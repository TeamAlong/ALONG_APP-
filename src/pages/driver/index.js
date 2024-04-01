import { useState, useEffect } from "react";
import axios from "axios";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import Layout from "@/components/Layout";
import Image from "next/image";
import LocationInput from "@/components/LocationInput";
import MapSection from "@/components/MapSection";
import { useDriverDestination } from "@/context/LocationContext/driver/DriverDestinationContext";
import { useDriverFrom } from "@/context/LocationContext/driver/DriverFromContext";
import { useTrip } from "@/context/TripContext/TripContext";
import AcceptModal from "@/components/driver/Accept-modal";
import MovementModal from "@/components/driver/Movement-modal";
import RideComplete from "@/components/driver/RideComplete";
import Circles from "../../../public/assets/loc-circles.svg";
import Rout from "../../../public/assets/route-icon.svg";
import Arrow from "../../../public/assets/arrow-right.svg";
import {
  useInterval
} from '@/hooks/useInterval';
import {
  useWebSocket
} from "@/context/WebSocketContext";


export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMovementModal, setShowMovementModal] = useState(false);
  const [showRideComplete, setShowRideComplete] = useState(false);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  const { setDriverLocation, setTripStaus } = useTrip();
  const { driverSource, setDriverSource } = useDriverFrom();
  const { driverDestination, setDriverDestination } = useDriverDestination();

  const [readyToSend, setReadyToSend] = useState(false);

  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 0,
    longitude: 0,
    zoom: 16,
  });

  const {
    activeTrip,
    updateTripLocation
  } = useTrip();

  const {
    socket
  } = useWebSocket();


  const containerStyle = {
    width: "100vw",
    height: "100vh",
    position: "absolute",
    top: 0,
    left: 0,
    // zIndex: -1,
  };

  useInterval(() => {
    if (activeTrip) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const {
          latitude,
          longitude
        } = position.coords;
        // Assuming 'updateTripLocation' sends the PATCH request to update the driver's current location
        updateTripLocation(latitude, longitude);
      }, (error) => {
        console.warn(`ERROR(${error.code}): ${error.message}`);
      });
    }
  }, 10000); // This interval is set to 10 seconds, adjust as needed


  useEffect(() => {
    function success(position) {
      setViewport((prevViewport) => ({
        ...prevViewport,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }));
      console.log("Drivers's location:", position.coords);
    }

    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error, {
        enableHighAccuracy: true,
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    if (driverSource) {
      console.log("source", driverSource);
      console.log("destination", driverDestination);
    }
  }, [driverSource, driverDestination]);

  const handleMovementModalClick = () => {
    setShowMovementModal(false); // Hide the MovementModal
    setShowRideComplete(true); // Show the RideComplete component
  };

  useEffect(() => {
    socket.on('rideRequest', (rideDetails) => {
      // Show accept modal with rideDetails
      // If accepted:
      socket.emit('rideAccepted', {
        rideId: rideDetails.rideId
      });
      setTripStatus('started'); // Update TripContext indicating the trip has started
    });

    socket.on('endTrip', () => {
      setTripStatus('ended'); // End the trip when user’s and driver’s locations diverge significantly
    });
  }, [socket, setTripStatus]);

  // Function to send driver's location updates -UNCOMMENT AND RENAME OR ADD TO THE SSAME NAME FUNCTION
  // const sendLocationData = () => {
  //   navigator.geolocation.getCurrentPosition((position) => {
  //     const location = {
  //       lat: position.coords.latitude,
  //       lng: position.coords.longitude
  //     };
  //     socket.emit('locationUpdate', {
  //       driverId: 'driver123',
  //       location
  //     }); // Use actual driver ID
  //     setDriverLocation(location); // Update driver's location in TripContext
  //   });
  // };

  // Example button to manually trigger location update for demonstration
  // return <button onClick = {
  //   sendLocationData
  // } > Send Location Update < /button>;

  console.log("Driver Source:", driverSource);
  console.log("Driver Destination:", driverDestination);

  const sendLocationData = async () => {
    setLoading(true);

    // Prepare the data for source and destination in the expected format
    const sourceData = {
      location: {
        type: "Point",
        coordinates: [driverSource.lng, driverSource.lat],
        address: driverSource.name,
      },
    };

    try {
      // Send source data
      console.log("Sending driver source data", sourceData);
      const response = await axios.post(
        "https://along-app-1.onrender.com/api/v1/drivers/createdriver",
        sourceData
      );
      console.log("Driver Source data sent successfully", response.data);

      // Store the driver's ID to local storage
      const driverId = response.data.data.driver._id;
      localStorage.setItem("driverId", driverId);
      console.log("Driver ID stored in local storage:", driverId);
    } catch (error) {
      console.error("Failed to send location data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    // setIsModalOpen(false); // Close the AcceptModal
    await sendLocationData(); // Send the location data after acceptance
    // setShowMovementModal(true); // Then show the MovementModal
  };

  return (
    <Layout>
      <main className="relative pt-40 pb-10 px-3 h-full flex flex-col items-center ">
        <LoadScript
          libraries={["places"]}
          googleMapsApiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY}
        >
          <div className="absolute top-0 left-0 right-0 bottom-0">
            <MapSection isDriver={true} />
          </div>

          <section className="w-full flex flex-col items-center gap-[80px] z-10 px-4">
            <section className="z-10 w-full flex items-center gap-6 px-4 py-[18px] rounded-lg bg-[#F2F2F2]">
              <Image src={Circles} alt="" />

              <div className="w-full flex flex-col">
                <LocationInput
                  label="From"
                  value={driverSource}
                  onChange={setDriverSource}
                  placeholder="Your location"
                  type="driverSource"
                />

                <LocationInput
                  label="To"
                  value={driverDestination}
                  onChange={setDriverDestination}
                  placeholder="Destination"
                  type="driverDestination"
                />
              </div>

              <Image src={Rout} alt="" />
            </section>

            {isModalOpen && <AcceptModal onAccept={handleAccept} />}
            {showRideComplete && <RideComplete />}
          </section>
        </LoadScript>

        {!showMovementModal && !showRideComplete && (
          <button
            className="w-[90%] fixed  bottom-16 flex items-center gap-5 justify-center self-center bg-[#F2F2F2] py-3 px-4 rounded-2xl text-xl text-[#717171] font-bold z-10"
            onClick={handleAccept}
          >
            {loading ? "Selecting route" : " Select your route"}

            <Image src={Arrow} alt="right arrow" />
          </button>
        )}
        {showMovementModal && (
          <MovementModal onSectionClick={handleMovementModalClick} />
        )}
      </main>
    </Layout>
  );
}

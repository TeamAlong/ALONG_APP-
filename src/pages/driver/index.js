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
import { useInterval } from "@/hooks/useInterval";
import { useFrom } from "@/context/LocationContext/user/FromContext";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [starting, setStarting] = useState(false);
  const [routeSelected, setRouteSelected] = useState(false);
  const {
    startTrip,
    selectedDriver,
    isAcceptModalOpen,
    closeAcceptModal,
    setDriverLocation,
  } = useTrip();
  const { driverSource, setDriverSource } = useDriverFrom();
  const { driverDestination, setDriverDestination } = useDriverDestination();

  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 0,
    longitude: 0,
    zoom: 16,
  });

  const {
    activeTrip,
    updateTripLocation,
    checkTripStatus,
    updateRideMovement,
    userLocation,
    driverLocation,
  } = useTrip();

  useInterval(() => {
    if (activeTrip) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          // Assuming 'updateTripLocation' sends the PATCH request to update the driver's current location
          try {
            await updateTripLocation(latitude, longitude);
            await updateRideMovement(
              userLocation,
              {
                latitude,
                longitude,
              },
              activeTrip.id
            );
            //await checkTripStatus();
          } catch (error) {
            console.error("Error updating ride movement:", error);
          }
        },
        (error) => {
          console.warn(`ERROR(${error.code}): ${error.message}`);
        },
        {
          enableHighAccuracy: true,
        }
      );
    }
  }, 10000); // 10 seconds

  useEffect(() => {
    function success(position) {
      setViewport((prevViewport) => ({
        ...prevViewport,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }));
      // console.log("Drivers's location:", position.coords);
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

      setDriverLocation(sourceData);

      // Store the driver's ID to local storage
      const driverId = response.data.data.driver._id;
      localStorage.setItem("driverId", driverId);
      console.log("Driver ID stored in local storage:", driverId);

      // Update routeSelected state to true
      setRouteSelected(true);
    } catch (error) {
      console.error("Failed to send location data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTrip = async () => {
    console.log("handleAccept called");

    if (!routeSelected) {
      setLoading(true); // Start loading
      console.log("Route not selected, sending location data...");
      await sendLocationData();
      console.log("Location data sent, routeSelected should now be true");
      setLoading(false); // Stop loading once the data is sent
    } else if (!activeTrip) {
      console.log("Route selected, starting trip...");
      setStarting(true); // Start the trip
      try {
        await startTrip();
        console.log("Trip started successfully");
      } catch (error) {
        console.error("Failed to start trip", error);
      } finally {
        setStarting(false); // Reset starting to false once trip starts or fails to start
        console.log("handleAccept operation completed");
      }
    } else {
      console.log("Trip already started or in progress.");
    }
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
          </section>
        </LoadScript>

        {/* {isAcceptModalOpen && selectedDriver && (
          <AcceptModal
          key={modalKey} 
            onAccept={() => {
              console.log("Driver accepted:", selectedDriver);
              closeAcceptModal();
              // Implement what happens after accepting here
            }}
          />
        )} */}

        <button
          className="w-[90%] fixed  bottom-16 flex items-center gap-5 justify-center self-center bg-[#F2F2F2] py-3 px-4 rounded-2xl text-xl text-[#717171] font-bold z-10"
          onClick={handleStartTrip}
        >
          {loading
            ? "Selecting route"
            : starting
            ? "Starting Trip"
            : routeSelected
            ? "Start Trip"
            : "Select your route"}

          <Image src={Arrow} alt="right arrow" />
        </button>
      </main>
    </Layout>
  );
}

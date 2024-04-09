"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { LoadScript } from "@react-google-maps/api";
import Layout from "@/components/Layout";
import Image from "next/image";
import LocationInput from "@/components/LocationInput";
import MapSection from "@/components/MapSection";
import { useUi } from "@/context/UiContext/uiContext";
import { useTrip } from "@/context/TripContext/TripContext";
import { useDriverDestination } from "@/context/LocationContext/driver/DriverDestinationContext";
import { useDriverFrom } from "@/context/LocationContext/driver/DriverFromContext";
import { useSocket } from "@/context/SocketContext/SocketContext";
import { toast } from "react-toastify";
import AcceptModal from "@/components/driver/Accept-modal";
import Circles from "../../../public/assets/loc-circles.svg";
import Rout from "../../../public/assets/route-icon.svg";
import Arrow from "../../../public/assets/arrow-right.svg";
import MovementModal from "@/components/driver/Movement-modal";

export default function Home() {
  const { socket, activeRide } = useSocket();
  const router = useRouter();
  const { setDriversSource, setRiderSource, driverDetails } = useTrip();
  const { driverSource, setDriverSource } = useDriverFrom();
  const { driverDestination, setDriverDestination } = useDriverDestination();

  const [buttonText, setButtonText] = useState("Go Live");
  const [requests, setRequests] = useState([]);
  const [showAccept, setShowAccept] = useState(false);

  // Check local storage for driverId on component mount
  useEffect(() => {
    const driverId = localStorage.getItem("driverId");

    // If driverId does not exist, redirect to the homepage
    if (!driverId) {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    if (socket) {
      const handleDriverRequest = (data) => {
        setRequests((prev) => [...prev, data.rider]);
        console.log("riders", data.rider);
        setShowAccept(true);
      };

      socket.on("driver-request", handleDriverRequest);

      // Clean up the effect by removing the event listener
      return () => socket.off("driver-request", handleDriverRequest);
    }
  }, [socket]); // Depend on `socket` to re-run the effect

  useEffect(() => {
    let watchId;

    // Function to handle new location data
    const handleLocationUpdate = (location) => {
      if (activeRide && socket) {
        const { latitude, longitude } = location.coords;

        // Emit the current location to the server
        socket.emit("update-ride", {
          driverId: socket.id, // Assuming the driver's ID is the socket ID
          // driverId: driverId, // Assuming the driver's ID is the socket ID
          location: { lat: latitude, lng: longitude },
        });
      }
    };

    // Function to handle location errors
    const handleError = (error) => {
      console.error("Location tracking error:", error);
    };

    // Start watching the driver's location if there's an active ride
    if (activeRide) {
      watchId = navigator.geolocation.watchPosition(
        handleLocationUpdate,
        handleError,
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    }

    // Cleanup function to stop watching the location when the component unmounts
    // or the active ride ends
    return () => {
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [activeRide, socket]);

  // Handler for going live
  const goLive = () => {
    console.log("Button clicked");

    if (socket && socket.connected && driverSource) {
      console.log("Socket is connected");
      console.log("Source is available", driverSource);

      // Retrieve and parse rider details from local storage
      const storedDriverDetails = localStorage.getItem("driverDetails");
      const driverDetails = storedDriverDetails
        ? JSON.parse(storedDriverDetails)
        : {};

      console.log("Driver details in trip context", driverDetails);

      // Directly constructing the object in the format the server expects
      const eventData = {
        name: driverDetails.name,
        type: "drivers",
        plateno: driverDetails.plateNumber,
        userId: driverDetails._id,
        location: { lat: driverSource.lat, lng: driverSource.lng },
        destination: { lat: driverDestination.lat, lng: driverDestination.lng },
      };
      console.log("sending liveData", eventData);

      socket.emit("go-live", eventData);
      console.log("Go Live event emitted"), toast.success("You are now live");
      setButtonText("Awaiting Passenger"); // Change button text dynamically
    } else {
      if (!socket || !socket.connected) {
        console.error("Socket is not connected.");
      } else {
        console.error("Location is not set.");
        toast.error("Please set your location before going live.");
      }
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
            {/* <MapSection  /> */}
          </div>

          {!showAccept && (
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
          )}
        </LoadScript>

        {/* Check if there is no activeRide, then show the accept modal and the go live button */}
        {!activeRide && (
          <>
            {!showAccept && (
              <button
                className="w-[90%] fixed bottom-16 flex items-center gap-5 justify-center self-center bg-[#F2F2F2] py-3 px-4 rounded-2xl text-xl text-[#717171] font-bold z-10"
                onClick={goLive}
              >
                {buttonText}
                <Image src={Arrow} alt="right arrow" />
              </button>
            )}

            {requests.length > 0 && (
              <AcceptModal requests={requests} socket={socket} />
            )}
          </>
        )}

        {/* Show the MovementModal if there is an activeRide */}
        {activeRide && <MovementModal />}
      </main>
    </Layout>
  );
}

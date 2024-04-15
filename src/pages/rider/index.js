"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { LoadScript } from "@react-google-maps/api";
import Layout from "@/components/Layout";
import LocationInput from "@/components/LocationInput";
import MapSection from "@/components/MapSection";
import Ticket from "@/components/user/Ticket";
import Image from "next/image";
import { useUi } from "@/context/UiContext/uiContext";
import { useFrom } from "@/context/LocationContext/user/FromContext";
import { useTrip } from "@/context/TripContext/TripContext";
import { useDestination } from "@/context/LocationContext/user/DestinationContext";
import { useSocket } from "@/context/SocketContext/SocketContext";
import { toast } from "react-toastify";
import Circles from "../../../public/assets/loc-circles.svg";
import Rout from "../../../public/assets/route-icon.svg";

export default function Home() {
  const { socket, activeRide } = useSocket();
  const { setShowDriversPreview, setShowSpin } = useUi();
  const { setDrivers, riderDetails } = useTrip();
  const router = useRouter();
  const { source } = useFrom();

  const [showFindDriversBtn, setShowFindDriversBtn] = useState(true);
  const { destination, setDestination } = useDestination();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [buttonText, setButtonText] = useState("Get ALong");
  const [status, setStatus] = useState(null);

  // Check local storage for riderId on component mount
  useEffect(() => {
    const riderId = localStorage.getItem("riderId");

    // If riderId does not exist, redirect to the homepage
    if (!riderId) {
      router.push("/");
    }
  }, [router]);

  // Adjusted to hide the "Get ALong" button when there is an active ride
  useEffect(() => {
    setShowFindDriversBtn(!activeRide);
  }, [activeRide]);

  useEffect(() => {
    if (socket) {
      // Listening for 'drivers' event from server
      const handleDriversEvent = (data) => {
        console.log("Drivers received:", data.drivers); // Now correctly placed inside callback
        setDrivers(data.drivers); // Populate drivers state with received data
        // setShowSpin(false);
        setShowDriversPreview(true); // Show drivers preview
        setShowFindDriversBtn(false); // Hide the "Get ALong" button
        toast.info(`${data.drivers.length} drivers found.`);

        console.log("Drivers received:", data.drivers);
      };

      socket.on("drivers", handleDriversEvent);

      return () => {
        socket.off("drivers", handleDriversEvent); // Clean up the listener
      };
    }
  }, [socket]); // This effect runs whenever 'socket' changes

  useEffect(() => {
    if (socket) {
      const handleRideStatusUpdated = ({ status }) => {
        console.log(`Ride status updated: ${status}`);
        // Pass the updated status to the MovementModal or handle it as needed
        setStatus(status); // Assuming you have a state [status, setStatus] to keep track of the ride status
      };

      socket.on("ride-status-updated", handleRideStatusUpdated);

      return () => socket.off("ride-status-updated", handleRideStatusUpdated);
    }
  }, [socket]);

  // Handler for going live
  const goLive = () => {
    console.log("Button clicked");

    if (socket && socket.connected && source) {
      console.log("Socket is connected");
      console.log("Source is available", source);

      // Retrieve and parse rider details from local storage
      const storedRiderDetails = localStorage.getItem("riderDetails");
      const riderDetails = storedRiderDetails
        ? JSON.parse(storedRiderDetails)
        : {};

      console.log("Rider details in trip context", riderDetails);

      // Directly constructing the object in the format the server expects
      const eventData = {
        name: riderDetails.name,
        type: "rider",
        userId: riderDetails._id,
        location: { lat: source.lat, lng: source.lng },
        destination: { lat: destination.lat, lng: destination.lng },
      };
      console.log("sending liveData", eventData);

      socket.emit("go-live", eventData);
      console.log("Go Live event emitted"), toast.success("You are now live");

      socket.emit("find-drivers", { lon: source.lng, lat: source.lat });
      console.log("Find drivers event emitted");
      // setButtonText("Get Along"); // Change button text dynamically
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
      <main className="relative pb-10 px-3 flex flex-col items-center gap-[130px]">
        <LoadScript
          libraries={["places"]}
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}
        >
          <div className="absolute top-0 left-0 right-0 bottom-0">
            {/* <MapSection isDriver={!!activeRide} /> */}
            {/* <MapSection  /> */}

            <MapSection isDriver={false} />
          </div>

          <section className="z-10 w-full flex items-center gap-6 px-4 py-[18px] rounded-lg bg-[#F2F2F2]">
            <Image src={Circles} alt="" />

            <div className="w-full flex flex-col">
              <LocationInput
                label="From"
                value={location}
                onChange={setLocation}
                placeholder="Your location"
                type="source"
              />

              <LocationInput
                label="To"
                value={destination}
                onChange={setDestination}
                placeholder="Destination"
                type="destination"
              />
            </div>

            <Image src={Rout} alt="" />
          </section>
        </LoadScript>

        {activeRide && (
          <div className="absolute top-[12%] z-50">
            <Ticket rideDetails={activeRide} />
          </div>
        )}

        {!activeRide && showFindDriversBtn && (
          <button
            className="w-[90%] self-center bg-[#F2F2F2] py-3 px-4 rounded-2xl text-xl text-[#717171] font-bold z-10 shadow-lg"
            onClick={goLive}
          >
            Get Along
          </button>
        )}
      </main>
    </Layout>
  );
}

import { useState, useEffect } from "react";
import { LoadScript } from "@react-google-maps/api";
import Layout from "@/components/Layout";
import LocationInput from "@/components/LocationInput";
import MapSection from "@/components/MapSection";
import Image from "next/image";
import { useUi } from "@/context/UiContext/uiContext";
// import { useTrip } from "@/context/TripContext/TripContext";
import { useFrom } from "@/context/LocationContext/user/FromContext";
import { useDestination } from "@/context/LocationContext/user/DestinationContext";
import Ticket from "@/components/user/Ticket";
import Circles from "../../public/assets/loc-circles.svg";
import Rout from "../../public/assets/route-icon.svg";
import axios from "axios";

export default function Home() {
  const { setShowSpin, setShowBtn, showBtn, showTicket, setShowTicket } =
    useUi();
  // const { setUserLocation } = useTrip();

  const { source, setSource } = useFrom();
  const { destination, setDestination } = useDestination();

  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [destination, setDestination] = useState(null);

  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 0,
    longitude: 0,
    zoom: 16,
  });

  useEffect(() => {
    function success(position) {
      setViewport((prevViewport) => ({
        ...prevViewport,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }));
      console.log("User's location:", position.coords);
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
    if (source) {
      console.log("source", source);
      console.log("destination", destination);
    }
  }, [source, destination]);

  const handleGetAlongClick = () => {
    // setShowSpin(false); // Hide the spin and show drivers preview
    // setShowBtn(false);

    // Call the function to send source and destination data
    sendLocationData(); // This sends the data right when the user clicks "Get Along"
  };

  const sendLocationData = async () => {
    setLoading(true);
    // Check if both source and destination are set
    if (!source || !destination) {
      console.log("Source or destination is not set");
      return;
    }

    // Prepare the data for source and destination in the expected format
    const sourceData = {
      location: {
        type: "Point",
        coordinates: [source.lng, source.lat],
        address: source.name,
      },
    };

    // const destinationData = {
    //   location: {
    //     type: "Point",
    //     coordinates: [destination.lng, destination.lat],
    //     address: destination.name,
    //   },
    // };

    try {
      // Send source data
      console.log("Sending source data", sourceData);
      await axios.post(
        "https://along-app-1.onrender.com/api/v1/passengers/create",
        sourceData
      );
      console.log("Source data sent successfully");

      // // Send destination data
      // console.log("Sending destination data", destinationData);
      // await axios.post("https://along-app-1.onrender.com/", destinationData);
      // console.log("Destination data sent successfully");
    } catch (error) {
      console.error("Failed to send location data", error);
    } finally {
      setLoading(false);
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
            <MapSection isDriver={false} />
          </div>

          {showTicket ? (
            <Ticket />
          ) : (
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
          )}
        </LoadScript>

        {showBtn && (
          <button
            className="w-[90%] self-center bg-[#F2F2F2] py-3 px-4 rounded-2xl text-xl text-[#717171] font-bold z-10"
            onClick={handleGetAlongClick}
          >
            {loading ? "Finding drivers" : "Get Along"}
          </button>
        )}
      </main>
    </Layout>
  );
}

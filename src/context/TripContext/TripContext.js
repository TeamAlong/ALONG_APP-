import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const TripContext = createContext();

export const useTrip = () => useContext(TripContext);

export const TripProvider = ({ children }) => {
  // Initialize state with defaults and update them from localStorage in useEffect
  const [userLocation, setUserLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [driverLocation, setDriverLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [activeTrip, setActiveTrip] = useState(null);
  const [tripStatus, setTripStatus] = useState(null); // 'waiting', 'moving', 'ended'

  useEffect(() => {
    // Only attempt to access localStorage when it is available (i.e., in the browser)
    const localUserLocation = localStorage.getItem("userLocation");
    const localDriverLocation = localStorage.getItem("driverLocation");

    if (localUserLocation) {
      setUserLocation(JSON.parse(localUserLocation));
    }

    if (localDriverLocation) {
      setDriverLocation(JSON.parse(localDriverLocation));
    }
  }, []);

  useEffect(() => {
    // Make sure window is available (i.e., code is running in the browser)
    if (typeof window !== "undefined") {
      localStorage.setItem("userLocation", JSON.stringify(userLocation));
    }
  }, [userLocation]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("driverLocation", JSON.stringify(driverLocation));
    }
  }, [driverLocation]);

  useEffect(() => {
    console.log("passenger source", userLocation);
    console.log("driver source", driverLocation);
  }, [userLocation, driverLocation]);

  const startTrip = async () => {
    const tripDetails = {
      userLocation,
      driverLocation,
    };

    console.log("Trip details prepared:", tripDetails);

    try {
      const response = await axios.post(
        "https://along-app-1.onrender.com/api/v1/rides/createride",
        tripDetails
      );
      setActiveTrip(response.data.newRide);
      setTripStatus("moving");
      console.log("Trip started successfully", response.data);
    } catch (error) {
      console.error("Error starting the trip:", error);
    }
  };

  const selectDriver = (driver) => {
    setSelectedDriver(driver);
    setIsAcceptModalOpen(true);
  };

  const closeAcceptModal = () => {
    setIsAcceptModalOpen(false);
  };

  const checkTripStatus = async () => {
    if (!activeTrip) return;

    try {
      const response = await axios.get(
        `https://along-app-1.onrender.com/api/v1/rides/${activeTrip.id}`
      );
      const { status } = response.data.ride; // Assuming the response includes the ride status

      if (status === "Arrived") {
        setTripStatus("ended");
        setActiveTrip(null); // Reset active trip if the trip has ended
      } else {
        setTripStatus(status); // Update trip status (e.g., 'Waiting', 'Moving')
      }
    } catch (error) {
      console.error("Error checking trip status:", error);
    }
  };

  const updateRideMovement = async (
    passengerLocation,
    driverLocation,
    rideId
  ) => {
    try {
      const response = await axios.patch(
        `https://along-app-1.onrender.com/api/v1/rides/updateride/${rideId}`,
        {
          passengerLocation,
          driverLocation,
        }
      );

      console.log("Ride status updated", response.data);
      // Optionally, update trip status based on the response
      setTripStatus(response.data.ride.status);
    } catch (error) {
      console.error("Error updating ride movement:", error);
    }
  };

  return (
    <TripContext.Provider
      value={{
        userLocation,
        setUserLocation,
        driverLocation,
        setDriverLocation,
        activeTrip,
        setActiveTrip,
        // updateTripLocation,
        startTrip,
        checkTripStatus,
        tripStatus,
        setTripStatus,
        updateRideMovement,
        selectedDriver,
        isAcceptModalOpen,
        selectDriver,
        closeAcceptModal,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

// tripContext.js
import React, { createContext, useContext, useState } from "react";

const TripContext = createContext();

export const useTrip = () => useContext(TripContext);

export const TripProvider = ({ children }) => {
  const [userLocation, setUserLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [driverLocation, setDriverLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [activeTrip, setActiveTrip] = useState(null);

  const updateTripLocation = async (latitude, longitude) => {
    if (!activeTrip) return;

    try {
      const response = await axios.patch(`https://along-app-1.onrender.com/api/v1/rides/updatelocation/${activeTrip.id}`, {
        lat: latitude,
        lng: longitude
      });

      console.log("Location updated", response.data);
    } catch (error) {
      console.error("Error updating location:", error);
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
        updateTripLocation
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

// tripContext.js
import React, { createContext, useContext, useState } from "react";
import axios from 'axios';


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
  const [tripStatus, setTripStatus] = useState(null); // 'waiting', 'moving', 'ended'

  const startTrip = async (tripDetails) => {
    try {
      const response = await axios.post('https://along-app-1.onrender.com/api/v1/rides/createride', tripDetails);
      setActiveTrip(response.data.newRide);
      setTripStatus('moving');
      console.log('Trip started successfully', response.data);
    } catch (error) {
      console.error('Error starting the trip:', error);
    }
  };

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

  const checkTripStatus = async () => {
    if (!activeTrip) return;

    try {
      const response = await axios.get(`https://along-app-1.onrender.com/api/v1/rides/${activeTrip.id}`);
      const {
        status
      } = response.data.ride; // Assuming the response includes the ride status

      if (status === 'Arrived') {
        setTripStatus('ended');
        setActiveTrip(null); // Reset active trip if the trip has ended
      
      } else {
        setTripStatus(status); // Update trip status (e.g., 'Waiting', 'Moving')
      }
    } catch (error) {
      console.error("Error checking trip status:", error);
    }
  };

  const updateRideMovement = async (passengerLocation, driverLocation, rideId) => {
    try {
      const response = await axios.patch(`https://along-app-1.onrender.com/api/v1/rides/updateride/${rideId}`, {
        passengerLocation,
        driverLocation,
      });

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
        updateTripLocation,
        startTrip,
        checkTripStatus,
        tripStatus,
        setTripStatus,
        updateRideMovement
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

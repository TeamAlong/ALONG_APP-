"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

// Create a context
const SocketContext = createContext();

// Export a custom hook to use the context
export const useSocket = () => useContext(SocketContext);

// Socket provider component
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [activeRide, setActiveRide] = useState(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io("http://localhost:3005", {
      query: {
        userId: 1, // Hardcoded user ID for now
      },
    });

    // Log when connected
    newSocket.on("connect", () => {
      console.log("Socket Connected:", newSocket.id);
    });

    // Log when disconnected
    newSocket.on("disconnect", (reason) => {
      console.log("Socket Disconnected:", reason);
    });

    // Log any errors
    newSocket.on("connect_error", (error) => {
      console.error("Connection Error:", error);
    });

    newSocket.on("rideUpdate", ({ ride }) => {
      setActiveRide(ride);
      console.log("Ride update received:", ride);
    });

    setSocket(newSocket);

    return () => {
      newSocket.off("connect");
      newSocket.off("disconnect");
      newSocket.off("connect_error");
      newSocket.off('rideUpdate');
      newSocket.close();
    }; // Cleanup on unmount
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("rideUpdate", ({ ride }) => {
        setActiveRide(ride);
      });

      return () => {
        socket.off("rideUpdate");
      };
    }
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket, activeRide }}>
      {children}
    </SocketContext.Provider>
  );
};

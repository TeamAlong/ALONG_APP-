import React, { createContext, useContext, useState } from "react";

const TripContext = createContext();

export const useTrip = () => useContext(TripContext);

export const TripProvider = ({ children }) => {
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);

  const selectDriver = (driver) => {
    setSelectedDriver(driver);
    setIsAcceptModalOpen(true);
  };

  const closeAcceptModal = () => {
    setIsAcceptModalOpen(false);
  };

  return (
    <TripContext.Provider
      value={{
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

import React, { createContext, useContext, useState } from 'react';

const DriversContext = createContext();

export function useDrivers() {
  return useContext(DriversContext);
}

export const DriversProvider = ({ children }) => {
  const [drivers, setDrivers] = useState([]);

  return (
    <DriversContext.Provider value={{ drivers, setDrivers }}>
      {children}
    </DriversContext.Provider>
  );
};

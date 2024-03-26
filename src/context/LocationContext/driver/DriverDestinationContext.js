import { createContext, useContext, useState, useEffect } from "react"

export const DriverDestinationContext = createContext();

export const useDriverDestination = () => useContext(DriverDestinationContext);

export const DriverDestinationProvider = ({ children }) => {
  const [driverDestination, setDriverDestination] = useState(null);

  useEffect(() => {
    console.log("destination", driverDestination);
  }, [driverDestination]);

  return (
    <DriverDestinationContext.Provider
      value={{
        driverDestination,
        setDriverDestination,
      }}
    >
      {children}
    </DriverDestinationContext.Provider>
  );
};

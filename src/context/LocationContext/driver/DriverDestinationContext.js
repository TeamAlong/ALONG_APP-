import { createContext, useContext, useState, useEffect } from "react"

export const DriverDestinationContext = createContext();

export const useDriverDestination = () => useContext(DriverDestinationContext);

export const DriverDestinationProvider = ({ children }) => {
  const [destination, setDestination] = useState([]);

  useEffect(() => {
    console.log("destination", destination);
  }, [destination]);

  return (
    <DriverDestinationContext.Provider
      value={{
        destination,
        setDestination,
      }}
    >
      {children}
    </DriverDestinationContext.Provider>
  );
};

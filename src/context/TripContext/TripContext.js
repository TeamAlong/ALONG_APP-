import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const TripContext = createContext();

export const useTrip = () => useContext(TripContext);

export const TripProvider = ({ children }) => {
  const [drivers, setDrivers] = useState([]);
  const [driversSource, setDriversSource] = useState(null);
  const [riderSource, setRiderSource] = useState(null);
  const [riderDestination, setRiderDestination] = useState(null);

  useEffect(() => {
    console.log("Drivers in trip context", drivers);
    console.log("Driver source in trip context", driversSource);
    console.log("Rider source in trip context", riderSource);
  }, [drivers, driversSource, riderSource]);

  return (
    <TripContext.Provider
      value={{
        drivers,
        setDrivers,
        driversSource,
        setDriversSource,
        riderSource,
        setRiderSource,
        riderDestination,
        setRiderDestination,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

import { createContext, useContext, useState, useEffect } from "react";

export const DriverFromContext = createContext();
export const useDriverFrom = () => useContext(DriverFromContext);

export const DriverFromProvider = ({ children }) => {
  const [driverSource, setDriverSource] = useState(null);

  useEffect(() => {
    console.log("driver Source", driverSource);
  }, [driverSource]);

  return (
    <DriverFromContext.Provider
      value={{
        driverSource,
        setDriverSource,
      }}
    >
      {children}
    </DriverFromContext.Provider>
  );
};

import { createContext, useContext, useState, useEffect } from "react";

export const DriverFromContext = createContext();
export const useDriverFrom = () => useContext(DriverFromContext);

export const DriverFromProvider = ({ children }) => {
  const [source, setSource] = useState([]);

  useEffect(() => {
    console.log("source", source);
  }, [source]);

  return (
    <DriverFromContext.Provider
      value={{
        source,
        setSource,
      }}
    >
      {children}
    </DriverFromContext.Provider>
  );
};

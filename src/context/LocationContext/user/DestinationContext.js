import { createContext, useContext, useState, useEffect } from "react"

export const DestinationContext = createContext();

export const useDestination = () => useContext(DestinationContext);

export const DestinationProvider = ({ children }) => {
  const [destination, setDestination] = useState(null);

  // useEffect(() => {
  //   console.log("destination", destination);
  // }, [destination]);

  return (
    <DestinationContext.Provider
      value={{
        destination,
        setDestination,
      }}
    >
      {children}
    </DestinationContext.Provider>
  );
};

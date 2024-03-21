import { createContext, useContext, useState, useEffect } from "react";

export const FromContext = createContext();
export const useFrom = () => useContext(FromContext);

export const FromProvider = ({ children }) => {
  const [source, setSource] = useState([]);

  useEffect(() => {
    console.log("source", source);
  }, [source]);

  return (
    <FromContext.Provider
      value={{
        source,
        setSource,
      }}
    >
      {children}
    </FromContext.Provider>
  );
};

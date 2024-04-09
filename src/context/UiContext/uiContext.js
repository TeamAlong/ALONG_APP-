import React, { createContext, useContext, useState } from "react";

const UiContext = createContext();

export const useUi = () => useContext(UiContext);

export const UiProvider = ({ children }) => {
  const [showSpin, setShowSpin] = useState(true);
  const [showBtn, setShowBtn] = useState(true);
  const [showArriving, setShowArriving] = useState(false);
  const [showAccept, setShowAccept] = useState(false);
  const [showTicket, setShowTicket] = useState(false);
  const [showDriversPreview, setShowDriversPreview] = useState(false);
  const [showMovementModal, setShowMovementModal] = useState(false);

  return (
    <UiContext.Provider
      value={{
        showSpin,
        setShowSpin,
        setShowBtn,
        showBtn,
        showArriving,
        setShowArriving,
        showTicket,
        setShowTicket,
        showDriversPreview,
        setShowDriversPreview,
        showAccept,
        setShowAccept,
        showMovementModal,
        setShowMovementModal,
      }}
    >
      {children}
    </UiContext.Provider>
  );
};

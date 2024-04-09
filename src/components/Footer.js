import { useEffect } from "react";
import Image from "next/image";
import { useUi } from "@/context/UiContext/uiContext";
import { useSocket } from "@/context/SocketContext/SocketContext";
import DriversPreview from "./user/drivers-preview";
import Arriving from "./user/Arriving";
import MovementModal from "./driver/Movement-modal";
import Spin from "../../public/assets/spin-board.svg";

export default function Footer() {
  const {
    showSpin,
    showArriving,
    showTicket,
    showDriversPreview,
    showMovementModal,
    setShowMovementModal,
  } = useUi();

  const { socket, activeRide } = useSocket();

  useEffect(() => {
    // Only set up the event listener if the socket object is not null
    if (socket) {
      const handleAccept = () => {
        setShowMovementModal(true);
      };

      socket.on("accept", handleAccept);
      console.log("Accept event listener set up successfully");

      return () => {
        // Clean up the event listener if the socket object is not null
        socket.off("accept", handleAccept);
      };
    }
  }, [socket, setShowMovementModal]);

  // If showTicket is true, return null or an empty fragment to render nothing
  if (showTicket) return null;
  return (
    <footer className=" fixed inset-x-0 bottom-0 w-full max-h-[320px] bg-[#F2F2F2] rounded-tl-[12px] rounded-tr-[12px] overflow-y-scroll z-50 ">
      {activeRide ? (
        <MovementModal />
      ) : showSpin ? (
        <div className="flex flex-col gap-2.5 items-center pt-4">
          <h3 className="text-xl font-semibold">CLICK AND SPIN TO WIN</h3>
          <Image src={Spin} alt="" />
        </div>
      ) : showArriving ? (
        <Arriving />
      ) : showDriversPreview ? (
        <DriversPreview />
      ) : null}
    </footer>
  );
}

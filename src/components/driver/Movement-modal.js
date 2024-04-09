import { useState, useEffect } from "react";
import Image from "next/image";
import Circle from "../../../public/assets/rout-circle.svg";
import Line from "../../../public/assets/rout-line.svg";
import Location from "../../../public/assets/rout-location.svg";
import User from "../../../public/assets/rout-user-pin.svg";
import { useSocket } from "@/context/SocketContext/SocketContext";

export default function MovementModal({ onSectionClick }) {
  const { socket , activeRide} = useSocket();
  const [status, setStatus] = useState("moving");
  // const [route, setRoute] = useState(false);

  
  // useEffect(() => {
  //   if (socket) {
  //     const handleRideStatusUpdated = ({ status }) => {
  //       console.log(`Ride status updated: ${status}`);
  //       setStatus(status);
  //     };

  //     socket.on("ride-status-updated", handleRideStatusUpdated);

  //     return () => {
  //       socket.off("ride-status-updated", handleRideStatusUpdated);
  //     };
  //   }
  // }, [socket]);

  useEffect(() => {
    // Whenever activeRide changes, update the status
    if (activeRide && activeRide.rideStatus) {
      setStatus(activeRide.rideStatus); // Update status based on activeRide's status
    }
  }, [activeRide]);

  // Logic to render UI based on the current status
  let content;
  switch (status) {
    case "accepted":
      content = <div>Accepted</div>;
      break;
      case "arrived":
      content = <div>Arrived</div>;
      break;
    case "moving to destination":
      content = <div>Driving to destination.</div>;
      break;
    case "completed":
      content = <div>Trip completed.</div>;
      break;
    // Handle other statuses as needed
    default:
      content = <div>Waiting...</div>;
      break;
  }

  // Determine what to display based on the current status
  // let headerText, bottomText;
  // if (status === "arrived") {
  //   headerText = "Kado junction1";
  //   bottomText = "Arrived";
  // } else if (status === "driving") {
  //   headerText = "KADO to BANNEX";
  //   bottomText = "Driving to destination";
  // }

  return (
    <main className=" fixed inset-x-0 bottom-0 w-full max-h-[320px] bg-[#F2F2F2] rounded-tl-[12px] rounded-tr-[12px] z-50 ">
      <section className="w-full flex flex-col items-center gap-4 bg-transparent">
        <div className="flex flex-col items-center gap-6 text-[#626262] pt-8 pb-4 font-semibold">
          {/* <h4 className="text-xl">{headerText}</h4> */}
          <p>10 mins. 25KM</p>
        </div>

        <div
          
          className="w-full bg-[#367ADD] text-[#EFEFEF] text-2xl font-semibold text-center py-4 rounded-b-xl cursor-pointer"
        >
          <p> {content}</p>
        </div>
      </section>
    </main>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { useUi } from "@/context/UiContext/uiContext";
import { useTrip } from "@/context/TripContext/TripContext";
import { useSocket } from "@/context/SocketContext/SocketContext";
import Stars from "../../../public/assets/review.svg";
import Driver from "../../../public/assets/driver-img.svg";
import Seat from "../../../public/assets/seat.svg";
import Car from "../../../public/assets/car.svg";

export default function DriversPreview() {

  const { drivers } = useTrip();
  const { socket } = useSocket(); // Use the socket context
  const { setShowAccept, showAccept } = useUi();

  const handleClick = (driver) => {
    console.log("Selecting driver:", driver);
    socket.emit('request-driver', {driverId: driver.id})
    console.log("Request driver event emitted")
  };

  return (
    <main className="w-full flex flex-col gap-11 p-2.5 overflow-y-scroll pt-12 ">
      {drivers.map((driver) => (
        <section
          key={driver.id}
          onClick={() => handleClick(driver)}
          className=" relative flex flex-col gap-6 pt-10 rounded-2xl bg-[#F2F2F2] border border-slate-300 shadow-md"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center bg-[#1C55A9] rounded-xl z-[10000]">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-[#F2F2F2]">
              <Image src={Car} alt="car icon" />
              <p className="text-sm text-[#F2F2F2]">{driver.plateno}</p>
              {/* <p className="text-sm text-[#F2F2F2]">{driver.PlateNumber}</p> */}
            </div>

            <div className="text-sm text-[#F2F2F2] px-4 py-2">
              <p>BANNEX JUNC</p>
            </div>
          </div>
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-1">
              <div className="w-[52px] h-[52px] rounded-[52px]">
                <Image
                  src={Driver}
                  alt="driver photo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-2">
                <h4 className="text-[#4E4E4E]">
                  {driver.name || "Unknown"}
                </h4>
                <p className="text-[#737373] text-xs">3 min away</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h4 className="text-[#424141] font-semibold">N1500.00</h4>
              <div className="flex items-center gap-[3px] text-black font-semibold">
                <Image src={Seat} alt="seat icon" />
                <p>4</p>
              </div>
            </div>
          </div>
          <div className="self-center">
            <Image src={Stars} alt="" />
          </div>
        </section>
      ))}
    </main>
  );
}

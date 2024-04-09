import React from "react";
import { useTrip } from "@/context/TripContext/TripContext";
import {useDriverDestination} from "@/context/LocationContext/driver/DriverDestinationContext"
import { useUi } from "@/context/UiContext/uiContext";

export default function AcceptModal({ requests, socket }) {
  const { setRiderSource, setRiderDestination } = useTrip();
  const { setDriverDestination } = useDriverDestination()
  const { setShowMovementModal } = useUi();

  return (
    <main className="z-50">
      {requests.map((request, index) => (
        <section
          key={`${request.id}-${index}`}
          className="flex flex-col gap-3.5 bg-[#F2F2F2] text-[#626262] font-semibold rounded-xl z-10"
        >
          <section className="flex flex-col items-center  gap-5 text-xl pt-[30px] pb-3.5 px-8">
            <p>KADO to BANNEX</p>
            <p>{request.name}</p>
            <p>10 mins. 25KM</p>
          </section>

          <div
            onClick={() => {
              // emit accept event
              socket.emit("accept", { riderId: request.id });
              setRiderSource(request.location);
              setRiderDestination(request.destination);
              // setDriverDestination(request.destination)
              setDriverDestination(request.location)

              // setShowMovementModal(true);
              console.log("accept event emitted");
            }}
            className="w-full bg-[#367ADD] py-3.5 px-[120px] text-xl font-semibold text-center text-[#EFEFEF] rounded-b-xl"
          >
            Accept
          </div>
        </section>
      ))}
    </main>
  );
}

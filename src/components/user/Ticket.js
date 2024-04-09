import { useState } from "react";
import Image from "next/image";
import Arrow from "../../../public/assets/arrow_back.svg";
import Share from "../../../public/assets/share.svg";
import User from "../../../public/assets/ticket-user-img.svg";
import Rout from "../../../public/assets/route-icon.svg";
import Calendar from "../../../public/assets/calendar.svg";
import Time from "../../../public/assets/time.svg";
import QR from "../../../public/assets/bx_qr.svg";
import { createNft } from "../../pages/api/underdog";
import { toast } from "react-toastify";

export default function Ticket({ rideDetails }) {
  const [minting, setMinting] = useState(false);

  const handleMintTicket = async () => {
    setMinting(true);
    const nftDetails = {
      rideStatus: rideDetails.rideStatus,
      driverId: rideDetails.driverId,
      riderId: rideDetails.riderId,
      currentDate: rideDetails.currentDate,
      fare: rideDetails.fare,
    };
    const response = await createNft(nftDetails);
    if (response) {
      console.log("NFT Minted Successfully", response);
      toast.success("Nft minted successfully");
    } else {
      console.error("Failed to mint NFT");
      toast.error("Failed to mint nft, please try again later");
    }
    setMinting(false);
  };

  // Destructure necessary details from rideDetails
  const { driverId, riderId, rideStatus, driverLocation, riderDestination } =
    rideDetails;

  function formatDate(date) {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(date).toLocaleDateString("en-US", options);
  }

  const currentDate = formatDate(new Date());

  const fromLocation = `${driverLocation.lat.toFixed(
    2
  )}, ${driverLocation.lng.toFixed(2)}`;
  const toLocation = `${riderDestination.lat.toFixed(
    2
  )}, ${riderDestination.lng.toFixed(2)}`;
  const fare = "N1500";
  const date = "27th Feb, 2024";
  const startTime = "02:30 PM";
  const endTime = "03:10 PM";

  return (
    <main className="max-w-[368px] w-full flex flex-col justify-center gap-6 bg-[#ECF0F6] text-black  p-4 rounded-2xl z-50">
      <section className="w-full flex items-center justify-between text-xl">
        <Image src={Arrow} alt="left arrow" />
        <h3>Your ticket</h3>
        <Image src={Share} alt="left arrow" />
      </section>

      <section className="w-full flex flex-col gap-6 rounded-3xl bg-[#F2F2F2] text-[#4F4F4F]">
        <div className="w-full flex flex-col gap-8">
          <div className="flex items-center justify-start gap-2">
            <div className="w-12 h-12 rounded-[48px]">
              <Image
                src={User}
                alt="user image"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col text-xs text-[#737373]">
              <h3 className="text-xl font-semibold text-[#4B4B4B]">
                Passenger ID: {riderId}
              </h3>
              <p>Driver ID: {driverId}</p>
              <p>Status: {rideStatus}</p>
            </div>
          </div>

          <div className="w-full flex items-center justify-between text-xl text-[#7E7E7E] font-semibold">
            <p>{fromLocation}</p>
            <Image src={Rout} alt="route icon" />
            <p>{toLocation}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 text-[#4F4F4F]">
          <div className="flex items-center gap-1">
            <Image src={Calendar} alt="calendar" />
            <p>{currentDate}</p>
          </div>

          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Image src={Time} alt="calendar" />
              <p>{startTime}</p>
            </div>
            <p>TO</p>

            <div className="flex items-center gap-1">
              <Image src={Time} alt="calendar" />
              <p>{endTime}</p>
            </div>
          </div>
        </div>

        <div className="w-full flex items-center justify-between px-4 py-8 border-t-4 border-dashed border-[#7E7E7E]">
          <div className="flex items-center gap-10">
            <div className="flex flex-col gap-3">
              <p>Fare</p>
              <p>{fare}</p>
            </div>

            <div className="flex flex-col gap-3">
              <p>Seat</p>
              <p>01</p>
            </div>
          </div>

          <Image src={QR} alt="qr code" />
        </div>
      </section>

      <button
        onClick={handleMintTicket}
        className="w-full py-4 px-8 bg-[#367ADD] text-[#E8E8E8] text-xl font-semibold rounded-2xl"
      >
        {minting ? "Minting" : "Mint Ticket"}
      </button>
    </main>
  );
}

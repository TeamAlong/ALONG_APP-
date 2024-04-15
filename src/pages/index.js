"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import axios from "axios";
import { toast } from "react-toastify";
import { useTrip } from "@/context/TripContext/TripContext";
import { createCnft } from "./api/underdog"


export default function Register() {
  const [activeForm, setActiveForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const ApiUrl = process.env.NEXT_PUBLIC_ALONG_API_URL;
  const router = useRouter();
  const {setRiderDetails, setDriverDetails} = useTrip()



  const [riderForm, setRiderForm] = useState({
    name: "",
    phoneNo: "",
    email: "",
    userType: "Rider",
  });

  const [driverForm, setDriverForm] = useState({
    name: "",
    phoneNo: "",
    email: "",
    userType: "Driver",
    plateNumber: "",
    carType: "",
    color: "",
  });

  // Update form input state
  const handleRiderInputChange = (e) => {
    setRiderForm({ ...riderForm, [e.target.name]: e.target.value });
  };

  const handleDriverInputChange = (e) => {
    setDriverForm({ ...driverForm, [e.target.name]: e.target.value });
  };

  // Submit handler for rider form
  const submitRiderForm = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await axios.post(
        "https://2527-154-120-65-34.ngrok-free.app/api/v1/riders/create",
        // `${ApiUrl}api/v1/riders/create`,
        riderForm
      );
      console.log(res.data);
      // Save rider details to localStorage
      localStorage.setItem("riderDetails", JSON.stringify(res.data.data.rider));
      localStorage.setItem("riderId", res.data.data.rider._id);

      console.log("riderId", res.data.data.rider._id);
      toast.success("Registration successful");
      router.push("/rider");
    } catch (error) {
      console.error("Form submission error:", error.res?.data || error.message);
      toast.error("Form failed to submit, please try again ");
    } finally {
      setLoading(false);
    }
  };

  // Submit handler for driver form
  const submitDriverForm = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const res = await axios.post(
       
        // `${ApiUrl}api/v1/drivers/createdriver`,
        "https://2527-154-120-65-34.ngrok-free.app/api/v1/drivers/createdriver",
        driverForm
      );
      console.log(res.data);

      // Save driver details to localStorage
      localStorage.setItem("driverDetails", JSON.stringify(res.data.data.driver));
      localStorage.setItem("driverId", res.data.data.driver._id);

      console.log("driverId", res.data.data.driver._id);
      toast.success("Registration successful");
      router.push("/driver");
    } catch (error) {
      console.error("Form submission error:", error.res?.data || error.message);
      toast.error("Form failed to submit, please try again ");
    } finally {
      setIsLoading(false);
    }
  };


  

  return (
    <main className="m-auto w-full py-8 px-5">
      <Navbar />

      {!activeForm && (
        <section className="w-full flex flex-col items-center gap-20 mt-20">
          <h2 className="text-zinc-950 text-lg font-bold">
            How do you want to use Along?
          </h2>

          <div className=" flex items-center gap-5">
            <button
              className="py-2 px-4 rounded shadow-sm bg-zinc-950 text-white"
              onClick={() => setActiveForm("rider")}
            >
              Rider
            </button>
            <button
              className="py-2 px-4 rounded shadow-sm bg-zinc-950 text-white"
              onClick={() => setActiveForm("driver")}
            >
              Driver
            </button>

           
          </div>
        </section>
      )}

      {/* Conditionally render the rider form based on activeForm state */}
      {activeForm === "rider" && (
        <section className="m-auto max-w-3xl w-full flex flex-col items-center justify-center gap-10 bg-[#F2F2F2] text-[#626262] rounded-md shadow-md py-10 px-5 self-center mt-20">
          <h2 className="text-zinc-950 text-lg font-bold self-center">
            Rider Registration
          </h2>

          <form
            onSubmit={submitRiderForm}
            className="w-full flex flex-col gap-10"
          >
            <div className="w-full grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                name="name"
                value={riderForm.name}
                onChange={handleRiderInputChange}
                className="w-full py-2 px-4 rounded border border-[#626262] text-[#626262] text-sm bg-transparent outline-none shadow-sm"
                placeholder="Name"
                type="text"
              />
              <input
                name="phoneNo"
                value={riderForm.phoneNo}
                onChange={handleRiderInputChange}
                className="w-full py-2 px-4 rounded border border-[#626262] text-[#626262] text-sm bg-transparent outline-none shadow-sm"
                placeholder="Phone number"
                type="number"
              />
              <input
                name="email"
                value={riderForm.email}
                onChange={handleRiderInputChange}
                className="w-full py-2 px-4 rounded border border-[#626262] text-[#626262] text-sm bg-transparent outline-none shadow-sm"
                placeholder="Email"
                type="email"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-md shadow-sm bg-zinc-950 text-white"
            >
              {loading ? "Submitting" : "Submit"}
            </button>
          </form>
        </section>
      )}

      {/* Conditionally render the driver form based on activeForm state */}
      {activeForm === "driver" && (
        <section className="m-auto max-w-3xl w-full flex flex-col items-center justify-center gap-10 bg-[#F2F2F2] text-[#626262] rounded-md shadow-md py-10 px-5 self-center mt-20">
          <h2 className="text-zinc-950 text-lg font-bold self-center">
            Driver Registration
          </h2>

          <form
            onSubmit={submitDriverForm}
            className="w-full flex flex-col gap-10"
          >
            <div className="w-full grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                name="name"
                value={driverForm.name}
                onChange={handleDriverInputChange}
                className="w-full py-2 px-4 rounded border border-[#626262] text-[#626262] text-sm bg-transparent outline-none shadow-sm"
                placeholder="Name"
                type="text"
              />
              <input
                name="phoneNo"
                value={driverForm.phoneNo}
                onChange={handleDriverInputChange}
                className="w-full py-2 px-4 rounded border border-[#626262] text-[#626262] text-sm bg-transparent outline-none shadow-sm"
                placeholder="Phone number"
                type="number"
              />
              <input
                name="email"
                value={driverForm.email}
                onChange={handleDriverInputChange}
                className="w-full py-2 px-4 rounded border border-[#626262] text-[#626262] text-sm bg-transparent outline-none shadow-sm"
                placeholder="Email"
                type="email"
              />

              <input
                name="plateNumber"
                value={driverForm.plateNumber}
                onChange={handleDriverInputChange}
                className="w-full py-2 px-4 rounded border border-[#626262] text-[#626262] text-sm bg-transparent outline-none shadow-sm"
                placeholder="Plate Number"
                type="text"
              />
              <input
                name="carType"
                value={driverForm.carType}
                onChange={handleDriverInputChange}
                className="w-full py-2 px-4 rounded border border-[#626262] text-[#626262] text-sm bg-transparent outline-none shadow-sm"
                placeholder="Car Model"
                type="text"
              />
              <input
                name="color"
                value={driverForm.color}
                onChange={handleDriverInputChange}
                className="w-full py-2 px-4 rounded border border-[#626262] text-[#626262] text-sm bg-transparent outline-none shadow-sm"
                placeholder="Color"
                type="text"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-md shadow-sm bg-zinc-950 text-white"
            >
              {isLoading ? "Submitting" : "Submit"}
            </button>
          </form>
        </section>
      )}
    </main>
  );
}

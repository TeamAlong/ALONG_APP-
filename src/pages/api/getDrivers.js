import axios from "axios";

// Define the function to fetch drivers within a certain distance
export const getDriversWithinDistance = async (
  lng,
  lat,
  distance = 100,
  unit = "mi",
 
) => {
  
  try {
    const response = await axios.get(
      `https://along-app-1.onrender.com/api/v1/drivers/drivers-within/${distance}/pass/${lng},${lat}/unit/${unit}`
    );

    console.log("distance", distance);
    console.log("Drivers fetched successfully:", response.data.data);

    return response.data;
  } catch (error) {
    console.error("Error fetching drivers:", error);
    throw error;
  }
};

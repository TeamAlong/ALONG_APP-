import axios from "axios";

export const calculateDrivingTime = async (origin, destination) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY; // Ensure your API key is securely stored and accessed
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    // Check if the response has routes and legs
    if (
      response.data.routes.length > 0 &&
      response.data.routes[0].legs.length > 0
    ) {
      const duration = response.data.routes[0].legs[0].duration.text; // e.g., "15 mins"
      return duration;
    } else {
      // Handle cases where no route could be found
      console.log("No route found between the specified locations.");
      return "No route found";
    }
  } catch (error) {
    console.error("Failed to calculate driving time", error);
    return "Unknown";
  }
};

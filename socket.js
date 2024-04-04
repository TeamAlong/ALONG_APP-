const io = require("socket.io-client");
const socket = io("http://localhost:3001"); // Adjust the URL according to your server's address

socket.on("connect", () => {
  console.log("Connected to server");
  socket.emit("joinRideRoom", "ride123");
});

socket.on("locationChanged", (location) => {
  console.log("Location changed:", location);
});

// Test sending an updateLocation event
setTimeout(() => {
  socket.emit("updateLocation", {
    rideId: "ride123",
    location: { latitude: 123, longitude: 456 },
  });
}, 5000);

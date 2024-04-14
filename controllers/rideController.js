const Ride = require("../models/rideModel");
const Driver = require("../models/driverModel");
const Passenger = require("../models/riderModel");
const AppError = require("../utils/appError");
const catchAsync = require("./../utils/catchAsync");
// const { setTimeout } = require("timers/promises");

// GET ride start location

// GET ride end location

exports.createRide = catchAsync(async (req, res, next) => {
  const newRide = await Ride.create(req.body);

  res.status(200).json({
    status: "Success",
    data: {
      newRide,
    },
  });
});

exports.isMoving = catchAsync(async (req, res, next) => {
  try {
    const { passengerLocation, driverLocation } = req.body;
    const rideId = req.params.id;

    // Input validation
    if (!passengerLocation || !driverLocation || !rideId) {
      return res
        .status(400)
        .json({ status: "error", message: "Missing required parameters" });
    }

    // console.log(passengerLocation);

    // Update the ride status
    const updatedRide = await updateRideStatus(
      passengerLocation,
      driverLocation,
      rideId
    );

    // Handle the result based on whether the ride was updated or not
    if (updatedRide) {
      res.status(200).json({ status: "success", ride: updatedRide });
    } else {
      res.status(200).json({
        status: "success",
        message: "Ride has not started yet or is already moving",
      });
    }
  } catch (error) {
    console.error("Error updating ride status:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }

  async function updateRideStatus(passengerLocation, driverLocation, rideId) {
    try {
      // console.log(passengerLocation);
      passengerLocation = String(passengerLocation);
      driverLocation = String(driverLocation);

      const [passengerLat, passengerLng] = passengerLocation.split(",");
      const [driverLat, driverLng] = driverLocation.split(",");

      // console.log(passengerLat);

      const distance = calculateDistance(
        passengerLat,
        passengerLng,
        driverLat,
        driverLng
      );
      console.log(distance);
      const thresholdDistance = 0.05;

      if (distance < thresholdDistance) {
        const ride = await Ride.findOneAndUpdate(
          { _id: rideId, status: "Waiting" },
          { status: "Moving" },
          { new: true }
        );
        return ride;
      }
      if (distance > thresholdDistance) {
        const ride = await Ride.findOneAndUpdate(
          { _id: rideId, status: "Moving" },
          { status: "Arrived" },
          { new: true }
        );
        return ride;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error updating ride status:", error);
      throw error;
    }
  }
});

exports.calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

// exports.updateLocation = catchAsync(async (req, res, next) => {
//   const { lat, lng } = req.body;
//   const rideId = req.params.id;

//   // Update ride with new location
//   const updatedRide = await Ride.findByIdAndUpdate(rideId, {
//     'currentLocation.coordinates': [lng, lat]
//   }, { new: true });

//   if (!updatedRide) {
//     return next(new AppError('No ride found with that ID', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       ride: updatedRide
//     }
//   });
// });

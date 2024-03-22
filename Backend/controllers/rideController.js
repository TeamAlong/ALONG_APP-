const Ride = require("../models/rideModel");
const Driver = require("../models/driverModel");
const Passenger = require("../models/passengerModel");
const AppError = require("../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const { setTimeout } = require("timers/promises");

exports.createRide = catchAsync(async (req, res, next) => {
  const newRide = await Ride.create(req.body);

  res.status(200).json({
    status: "Success",
    data: {
      newRide,
    },
  });
});

exports.getDriversWithin = catchAsync(async (req, res, next) => {
  const { distance } = req.params;
  const { passengerLocation, driverLocation } = req.body;

  const [passengerLat, passengerLng] = passengerLocation.split(",");
  const [driverLat, driverLong] = driverLocation.split(",");

  // Latitude and Longitude values for passenger.
  console.log("Passenger Latitude:", passengerLat);
  console.log("Passenger Longitude:", passengerLng);

  // const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng)
    next(
      new AppError(
        "Please provide latitude and longitude in the format lat, lng",
        400
      )
    );

  console.log(Number(distance), Number(lat), lng, unit);
  const drivers = await Driver.find({
    driverLocation: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [passengerLat, passengerLng],
        },
        $maxDistance: distance,
      },
    },
  });
  // console.log(drivers);
  res.status(200).json({
    status: "success",
    //results: drivers.length,
    // data: {
    //   data: drivers,
    // },
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");

  const multiplier = unit === "mi" ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(
      new AppError(
        "Please provide latitude and longitude in the format lat, lng",
        400
      )
    );
  }

  const distances = await Driver.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [lat * 1, lng * 1],
        },
        distanceField: "distance",
        distanceMultiplier: 0.001,
      },
    },
  ]);

  console.log(lat, lng);

  res.status(200).json({
    status: "success",
    data: {
      data: distances,
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
      // const { latitude: passengerLat, longitude: passengerLng } =
      //   passengerLocation;
      // const { latitude: driverLat, longitude: driverLng } = driverLocation;
      console.log(passengerLocation);

      // const [passengerLat, passengerLng] = passengerLocation.split(",");
      // const [driverLat, driverLng] = driverLocation.split(",");

      const { latitude: passengerLat, longitude: passengerLng } =
        req.body.passengerLocation;
      const { latitude: driverLat, longitude: driverLng } =
        req.body.driverLocation;

      console.log(passengerLat);

      const distance = calculateDistance(
        passengerLat,
        passengerLng,
        driverLat,
        driverLng
      );
      console.log(distance);
      const thresholdDistance = 0.1; // Adjust threshold distance as needed

      if (distance < thresholdDistance) {
        const ride = await Ride.findOneAndUpdate(
          { _id: rideId, moving: false },
          { moving: true },
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

function calculateDistance(lat1, lon1, lat2, lon2) {
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
}

const Driver = require("../models/driverModel");
const AppError = require("../utils/appError");
const catchAsync = require("./../utils/catchAsync");

exports.createDriver = catchAsync(async (req, res, next) => {
  const passenger = await Driver.create(req.body);

  res.status(200).json({
    status: "Success",
    data: {
      passenger,
    },
  });
});

exports.getDriversWithin = catchAsync(async (req, res, next) => {
  const { distance, passengerLocation } = req.params;
  // const { passengerLocation, driverLocation } = req.body;

  const [passengerLat, passengerLng] = passengerLocation.split(",");
  //   const [driverLat, driverLong] = driverLocation.split(",");

  // Latitude and Longitude values for both passenger.
  console.log("Passenger Latitude:", passengerLat);
  console.log("Passenger Longitude:", passengerLng);

  // const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;

  if (!passengerLat || !passengerLng)
    next(
      new AppError(
        "Please provide latitude and longitude in the format lat, lng",
        400
      )
    );

  // console.log(Number(distance), Number(lat), lng, unit);
  const drivers = await Driver.find({
    location: {
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
    results: drivers.length,
    data: {
      data: drivers,
    },
  });
});

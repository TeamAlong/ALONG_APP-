const Passenger = require("./../models/passengerModel");
const AppError = require("./../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.createPassenger = catchAsync(async (req, res, next) => {
  const passenger = await Passenger.create(req.body);

  // if (!req.body) {
  //   return next(new AppError("No location data sent", 201));
  // }

  res.status(200).json({
    status: "Success",
    data: {
      passenger,
    },
  });
});

exports.updatePassenger = catchAsync(async (req, res, next) => {
  const passenger = await Passenger.findByIdAndUpdate(req.params.id, req.body);
});

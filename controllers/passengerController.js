const catchAsync = require("../utils/catchAsync");
const Passenger = require("./../models/passengerModel");
const AppError = require("./../utils/appError");

exports.createPassenger = catchAsync(async (req, res, next) => {
  const passenger = await Passenger.create(req.body);

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

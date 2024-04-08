const Rider = require("../models/riderModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.createPassenger = catchAsync(async (req, res, next) => {
  const rider = await Rider.create(req.body);

  if (!req.body)
    next(
      new AppError(
        "Please provide latitude and longitude in the format lat, lng",
        400
      )
    );

  res.status(200).json({
    status: "Success",
    data: {
      rider,
    },
  });
});

exports.updatePassenger = catchAsync(async (req, res, next) => {
  const rider = await Rider.findByIdAndUpdate(req.params.id, req.body);
});

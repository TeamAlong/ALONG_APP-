// const crypto = require("crypto");
const mongoose = require("mongoose");
// const validator = require("validator");
// const bcrypt = require("bcryptjs");

const driverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    enum: ["Driver", "Rider"],
  },
  email: {
    type: String,
    required: true,
  },
  plateNumber: {
    type: String,
    required: true,
  },
  carType: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
});

// driverSchema.index({ location: "2dsphere" });

driverSchema.post("save", function (doc, next) {
  console.log(doc);
  next();
});

const Driver = mongoose.model("Driver", driverSchema);

module.exports = Driver;

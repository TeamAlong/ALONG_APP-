const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const driverSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "hi",
  },
  firstName: {
    type: String,
    default: "driver",
  },
  location: {
    type: {
      type: String,
      default: "Point",
      enum: ["Point"],
      required: true,
    },
    coordinates: [Number],
    address: String,
  },
});

driverSchema.index({ location: "2dsphere" });

driverSchema.post("save", function (doc, next) {
  console.log(doc);
  next();
});

const Driver = mongoose.model("Driver", driverSchema);

module.exports = Driver;

const mongoose = require("mongoose");

const passengerSchema = new mongoose.Schema({
  location: {
    // GeoJSON
    type: {
      type: String,
      default: "Point",
      enum: ["Point"],
    },
    coordinates: [Number],
    address: String,
  },
  seat: {
    type: Number,
  },
});

passengerSchema.index({ locations: "2dsphere" });

passengerSchema.post("save", function (doc, next) {
  console.log(doc);
  next();
});

const Passenger = mongoose.model("Passenger", passengerSchema);

module.exports = Passenger;

const mongoose = require("mongoose");

const riderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: String,
    default: "driver",
  },
  userType: {
    type: String,
    enum: ["Driver", "Rider"],
  },
  email: {
    type: String,
    required: true,
  },
});

// riderSchema.index({ location: "2dsphere" });

riderSchema.post("save", function (doc, next) {
  console.log(doc);
  next();
});

const Rider = mongoose.model("Rider", riderSchema);

module.exports = Rider;

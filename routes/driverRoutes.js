const express = require("express");
const driverController = require("../controllers/driverController");
// const authController = require("../authController");

const router = express.Router();

router.post("/createdriver", driverController.createDriver);

router
  .route("/drivers-within/:distance/pass/:passengerLocation/unit/:unit")
  .get(driverController.getDriversWithin);
// /tour-within?distance=100&pass=-40789,45345&unit=mi
// /tours-within/100/pass/-40789,45345/unit/mi

module.exports = router;

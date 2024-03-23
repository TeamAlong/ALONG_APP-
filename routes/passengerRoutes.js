const express = require("express");
const passengerController = require("./../controllers/passengerController");

const router = express.Router();

router.post("/create", passengerController.createPassenger);

module.exports = router;

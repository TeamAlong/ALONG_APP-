const express = require("express");
const riderController = require("./../controllers/riderController");

const router = express.Router();

router.post("/create", riderController.createRider);

module.exports = router;

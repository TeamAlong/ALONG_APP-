const express = require("express");
const rideController = require("./../controllers/rideController");
//const authController = require('./../controllers/authController');

const router = express.Router();

router.route("/createride").post(rideController.createRide);
router.route("/updateride/:id").patch(rideController.isMoving);

// router.route('/updatelocation/:id').patch(rideController.updateLocation);

// router.route("/distances/:latlng/unit/:unit").get(rideController.getDistances);

module.exports = router;

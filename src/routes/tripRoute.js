const express = require("express");

const Task = require("../models/tripModel");

const router = express.Router();
const tripController = require("../controllers/tripController");

//Get trips
router.get("/", tripController.getTrips);
router.get("/stations/station/:id", tripController.getSingleStationInfo)
router.post("/trips/add-trip", tripController.createTrip)

module.exports=router




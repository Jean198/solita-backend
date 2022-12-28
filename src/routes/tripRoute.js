const express = require("express");

const Task = require("../models/tripModel");

const router = express.Router();
const tripController = require("../controllers/tripController");

//Get trips
router.get("/", tripController.getTrips);

module.exports=router




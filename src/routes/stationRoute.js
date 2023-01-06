const express = require("express");
const Station = require("../models/stationModel");
const router = express.Router();
const stationsController = require("../controllers/stationsController");

router.get("/stations", stationsController.getStations);
router.post("/stations/add-station", stationsController.createStation);
router.get("/stations/station/:id", stationsController.getSingleStationInfo);

module.exports = router;

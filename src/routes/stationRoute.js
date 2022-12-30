const express = require("express");
const Station=require('../models/stationModel');
const router = express.Router();
const stationsController=require('../controllers/stationsController');



router.get("/stations", stationsController.getStations)

module.exports=router
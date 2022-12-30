const mongoose = require("mongoose");

const stationSchema = mongoose.Schema({
    FID: {
    type: String,
  },
  id: {
    type: String,
    required: true,
  },

 name: {
    type: String,
    required: true,
  },

  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  operator: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  x: {
    type: Number,
    required: false,
  },
  y: {
    type: Number,
    required: false,
  }
});

const Station = mongoose.model("Station", stationSchema, "stations");

module.exports = Station;

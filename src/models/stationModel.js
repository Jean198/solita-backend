const mongoose = require("mongoose");

const stationSchema = mongoose.Schema({
    FID: {
    type: String,
  },
  id: {
    type: String,
    required: false,
  },

 name: {
    type: String,
  },

  address: {
    type: String,
  },
  city: {
    type: String,
  },
  operator: {
    type: String,
  },

  x: {
    type: Number,
  },
  y: {
    type: Number,
  }
});

const Station = mongoose.model("Station", stationSchema, "stations");

module.exports = Station;

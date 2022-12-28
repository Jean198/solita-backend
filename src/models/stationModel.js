const mongoose = require("mongoose");

const taskSchema = mongoose.Schema(
  {
    departure_date: {
      type: Date,
      required: [true, "please add a return date"]
    },
    return_date: {
      type: Date,
      required: [true, "please add a return date"]

    },

    departure_station_id:{
        type:String,
        required:true
    },

    departure_station_name:{
        type:String,
        required:true
    },
    return_station_id:{
        type:String,
        required:true
    },
    return_station_name:{
        type:String,
        required:true
    },
    covered_distance_m:{
        type:Number,
        required:true
    },
    duration_sec:{
        type:Number,
        required:true
    }
  }
);

const Trip = mongoose.model("Trip", taskSchema, "helsinki_bikes_5");

module.exports = Trip;

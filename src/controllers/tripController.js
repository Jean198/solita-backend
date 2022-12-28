const Trip = require("../models/tripModel");

//Get all trips
const getTrips = async(req,res) => {

    try {
        //Model.find().select({ name: 1, _id: 0 });
      const trips = await Trip.find().limit(10);
      res.status(200).json(trips);
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }

};


module.exports = {
    getTrips,
  };
const Station=require("../models/stationModel")

const getStations=async(req,res)=>{
    try {
        const tasks = await Station.find();
        res.status(200).json(tasks);
      } catch (error) {
        res.status(500).json({ msg: error.message });
      }
}

module.exports = {
    getStations,
  };

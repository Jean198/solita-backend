const Station=require("../models/stationModel")

const getStations=async(req,res)=>{
    try {
        const tasks = await Station.find().limit(15);
        res.status(200).json(tasks);
      } catch (error) {
        res.status(500).json({ msg: error.message });
      }
}

const getStationOccurences=async(req,res)=>{
    const station_id=req.params.id;
    try {
        const departureCounts = await Station.find({id:[station_id]}).count();
        res.status(200).json(tasks);
      } catch (error) {
        res.status(500).json({ msg: error.message });
      }

}

module.exports = {
    getStations,
  };




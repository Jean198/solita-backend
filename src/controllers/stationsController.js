const Station = require("../models/stationModel");

const getStations = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 0;
    const search = req.query.search;
    const offset = limit * page;


    let stationsCollection;
    let stationsCollectionCount;

    if (search) {
      stationsCollection = await Station.find({
        name: { $regex: search, $options: "i" },
      })
        .skip(offset)
        .limit(limit);
      stationsCollectionCount = await Station.count({
        name: { $regex: search, $options: "i" },
      });
    } else {
      stationsCollection = await Station.find().skip(offset).limit(limit);
      stationsCollectionCount = await Station.count();
    }

    const allStations = await Station.find({});

    const totalPages = Math.ceil(stationsCollectionCount / limit);

    res.status(200).send({
      data: stationsCollection,
      paging: {
        total: stationsCollectionCount,
        page: page,
        numberOfPages: totalPages,
      },
      allStations: allStations,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const createStation = async (req, res) => {
  console.log("request sent")
  try {
    const station = await new Station({
      fid:req.body.fid,
      id: req.body.stationId,
      name: req.body.stationName,
      address: req.body.stationAddress,
      city:req.body.city,
      operator: req.body.operator,
      y:parseFloat(req.body.latitude),
      x:parseFloat(req.body.longitude)
    });
    console.log(station)
    res.status(200).json(station);
    station.save();
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  getStations,
  createStation,
};

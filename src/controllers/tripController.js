const Trip = require("../models/tripModel");

//Get all trips
const getTrips = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 15;
    const page = parseInt(req.query.page) || 0;
    const search = req.query.search;
    const searchType = req.query.searchType;
    const offset = limit * page;

    let tripsCollection;
    let tripsCollectionCount;

    if (search) {
      tripsCollection = await Trip.find({
        [searchType]: { $regex: search, $options: "i" },
      })
        .skip(offset)
        .limit(limit);
      tripsCollectionCount = await Trip.count({
        [searchType]: { $regex: search, $options: "i" },
      });
    } else {
      tripsCollection = await Trip.find().skip(offset).limit(limit);
      tripsCollectionCount = await Trip.count();
    }


    const totalPages = Math.ceil(tripsCollectionCount / limit);

    res.status(200).send({
      data: tripsCollection,
      paging: {
        total: tripsCollectionCount,
        page: page,
        numberOfPages: totalPages,
      },
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getStationOccurences = async (req, res) => {
  console.log(req.params.id);
  const station_id = req.params.id;
  try {
    const departureCounts = await Trip.find({
      departure_station_id: [station_id],
    }).count();
    const returnCounts = await Trip.find({
      return_station_id: [station_id],
    }).count();
    res.status(200).json({ departureCounts, returnCounts });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  getTrips,
  getStationOccurences,
};

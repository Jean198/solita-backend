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

    const popularDepartures = await Trip.aggregate()
      .sortByCount("departure_station_name")
      .limit(5);
    const popularReturns = await Trip.aggregate()
      .sortByCount("return_station_name")
      .limit(5);

    const totalPages = Math.ceil(tripsCollectionCount / limit);

    res.status(200).send({
      data: tripsCollection,
      paging: {
        total: tripsCollectionCount,
        page: page,
        numberOfPages: totalPages,
      },

      popularDepartureStations: popularDepartures,
      popularReturnStations: popularReturns,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


//-----------------------------------------------------------------------------------------------------------------------------------

//Create new trip
const createTrip = async (req, res) => {
  console.log("request sent");
  try {
    const trip = await new Trip({
      departure_date: req.body.departureDate,
      return_date: req.body.returnDate,
      departure_station_id: req.body.departureStationId,
      departure_station_name: req.body.departureStationName,
      return_station_id: req.body.returnStationId,
      return_station_name: req.body.returnStationName,
      covered_distance_m: parseFloat(req.body.distance),
      duration_sec: parseFloat(req.body.duration),
    });
    console.log(trip);
    res.status(200).json(trip);
    trip.save();
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  getTrips,
  createTrip,
};

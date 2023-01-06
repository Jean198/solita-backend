const Station = require("../models/stationModel");
const Trip = require("../models/tripModel");

//Get all stations
const getStations = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 0;
    const search = req.query.search;
    const offset = limit * page;

    let stationsCollection;
    let stationsCollectionCount;

    if (search) {
      // When searching for stations
      stationsCollection = await Station.find({
        name: { $regex: search, $options: "i" },
      })
        .skip(offset)
        .limit(limit);
      stationsCollectionCount = await Station.count({
        name: { $regex: search, $options: "i" },
      });
    } else {
      //When rendering all stations without searching
      stationsCollection = await Station.find().skip(offset).limit(limit);
      stationsCollectionCount = await Station.count();
    }

    const allStations = await Station.find({}); //Getting all stations all at once, not by page. This is used to render all stations locations on the map.

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

//------------------------------------------------------------------------------------------------------------

//Getting single station information
const getSingleStationInfo = async (req, res) => {
  const station_id = req.params.id;
  try {
    const stationDepartureTripsArray = await Trip.find({
      departure_station_id: [station_id],
    });

    const stationReturnTripsArray = await Trip.find({
      return_station_id: [station_id],
    });

    //Count trips that started  and those ended at a single station.
    const departureCounts = await Trip.find({
      departure_station_id: [station_id],
    }).count();
    const returnCounts = await Trip.find({
      return_station_id: [station_id],
    }).count();

    // Get popular  departure stations for single station view
    const popularDepartureStations = await Trip.aggregate([
      {
        $match: {
          return_station_id: station_id,
        },
      },
    ])
      .sortByCount("departure_station_name")
      .limit(5);

    // Get popular return stations for single station view
    const popularReturnStations = await Trip.aggregate([
      {
        $match: {
          departure_station_id: station_id,
        },
      },
    ])
      .sortByCount("return_station_name")
      .limit(5);

    //Function that calculates the average distances
    const averageDistance = async (stationTrips) => {
      var sum = 0;
      for (var i = 0; i < stationTrips.length; i++) {
        sum += stationTrips[i].covered_distance_m;
      }
      return sum;
    };

    //Calculate the average distances for the single station
    const averageDepartureDistance =
      (await averageDistance(stationDepartureTripsArray)) / departureCounts;
    const averageReturnDistance =
      (await averageDistance(stationReturnTripsArray)) / returnCounts;

    res.status(200).json({
      departureCounts,
      returnCounts,
      popularDepartureStations,
      popularReturnStations,
      averageDepartureDistance,
      averageReturnDistance,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

//------------------------------------------------------------------------------------------------------------

//Creating a new station
const createStation = async (req, res) => {
  console.log("request sent");
  try {
    const station = await new Station({
      fid: req.body.fid,
      id: req.body.stationId,
      name: req.body.stationName,
      address: req.body.stationAddress,
      city: req.body.city,
      operator: req.body.operator,
      y: parseFloat(req.body.latitude),
      x: parseFloat(req.body.longitude),
    });
    console.log(station);
    res.status(200).json(station);
    station.save();
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  getStations,
  getSingleStationInfo,
  createStation,
};

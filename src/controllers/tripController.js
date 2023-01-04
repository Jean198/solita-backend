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

const getSingleStationInfo = async (req, res) => {
  const station_id = req.params.id;
  try {
    //------------------------------------------------------------------------------------------------------------------
    const stationDepartureTripsArray = await Trip.find({
      departure_station_id: [station_id],
    });

    const stationReturnTripsArray = await Trip.find({
      return_station_id: [station_id],
    });
    //------------------------------------------------------------------------------------------------------------------

    //Count trips that started  and those ended at a single station.
    const departureCounts = await Trip.find({
      departure_station_id: [station_id],
    }).count();
    const returnCounts = await Trip.find({
      return_station_id: [station_id],
    }).count();

    //------------------------------------------------------------------------------------------------------------------

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

    //------------------------------------------------------------------------------------------------------------------

    //Function that calculates the average distances
    const averageDistance = async (stationTrips) => {
      var sum = 0;
      for (var i = 0; i < stationTrips.length; i++) {
        sum += stationTrips[i].covered_distance_m;
      }
      return sum;
    };

    //------------------------------------------------------------------------------------------------------------------

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

module.exports = {
  getTrips,
  getSingleStationInfo,
};

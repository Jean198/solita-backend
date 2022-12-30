const Station = require("../models/stationModel");

const getStations = async (req, res) => {
  console.log("got request")
  try {
    const limit = parseInt(req.query.limit) || 15;
    const page = parseInt(req.query.page) || 0;
    const search = req.query.search;
    const searchType = req.query.searchType;
    const offset = limit * page;

    /*

    const tasks = await Station.find().limit(15);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
  */

    let stationsCollection;
    let stationsCollectionCount;

    if (search) {
      stationsCollection = await Station.find({
        [searchType]: { $regex: search, $options: "i" },
      })
        .skip(offset)
        .limit(limit);
      stationsCollectionCount = await Station.count({
        [searchType]: { $regex: search, $options: "i" },
      });
    } else {
      stationsCollection = await Station.find().skip(offset).limit(limit);
      stationsCollectionCount = await Station.count();
    }

    const totalPages = Math.ceil(stationsCollectionCount / limit);

    res.status(200).send({
      data: stationsCollection,
      paging: {
        total: stationsCollectionCount,
        page: page,
        numberOfPages: totalPages,
      },
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  getStations,
};

const express = require("express");
const dotenv = require("dotenv").config();
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const tripRoute = require("./routes/tripRoute");
const stationRoute=require("./routes/stationRoute")
const PORT = process.env.PORT || 5000;

mongoose.set("strictQuery", true);

//middlewares
app.use(cors());
app.use(tripRoute);
app.use(stationRoute)
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to mongoDb")
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(error);
  });

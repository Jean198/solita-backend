const express = require("express");
const dotenv = require("dotenv").config();
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const tripRoute = require("./routes/tripRoute");
const PORT = process.env.PORT || 5000;

mongoose.set("strictQuery", true);

//middlewares
app.use(tripRoute);
app.use(cors());

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

const express = require("express");
const connectDB = require("./config/db");
const startJob = require("./jobs/pricefetch");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to the database
connectDB();

// Start the background job
startJob();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

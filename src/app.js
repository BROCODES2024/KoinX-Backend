const express = require("express");
const connectDB = require("./config/db");
const cryptoRoutes = require("./routes/cryptoroutes");
// Importing the routes
const startJob = require("./jobs/pricefetch");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to the database
connectDB();

// Start the background job
startJob();

// Use the routes
app.use("/api", cryptoRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

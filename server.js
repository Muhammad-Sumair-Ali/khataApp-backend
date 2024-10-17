const express = require('express');
const cors = require('cors');
const connectDB = require('./config/databaseConnection');
require('dotenv').config();

const app = express();

connectDB();

app.use(express.json());
app.use(cors());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api', require('./routes/customerRoutes'));

app.get("/", (req, res) => {
  res.status(200).send("Welcome to Khata API");
});


module.exports = app;

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/databaseConnection');
require('dotenv').config();

const app = express();

connectDB();



// Apply CORS with options
app.use(cors({
  origin: "http://localhost:5173"
},));

app.use(express.json());

const PORT = process.env.PORT || 5000;

// Define routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api', require('./routes/customerRoutes'));

app.get("/", (req, res) => {
  res.status(200).send("Welcome to Khata API");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

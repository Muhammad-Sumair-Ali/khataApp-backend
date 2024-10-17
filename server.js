const express = require('express');

const cors = require('cors');
const connectDB = require('./config/databaseConnection');
require('dotenv').config();

const app = express();


connectDB()


app.use(express.json());
app.use(cors());


app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api', require('./routes/customerRoutes'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

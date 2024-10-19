const express = require('express');
const cors = require('cors');
const connectDB = require('./config/databaseConnection');
require('dotenv').config();

const app = express();
connectDB();

const corsOptions = {
   origin: "https://khaata-app.vercel.app",
   credentials: true,
    methods:["GET","PUT","PATCH","POST","DELETE" ],
 
};
app.options("", cors(corsOptions));

app.use(cors(corsOptions));
app.use(express.json());
const PORT = process.env.PORT || 5000;

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api', require('./routes/customerRoutes'));

app.get("/hello", (req, res) => {
  res.status(200).send("Welcome to Khata API");
});
  
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

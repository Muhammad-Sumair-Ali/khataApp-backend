const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const User = require('./models/User'); 
const Customer = require('./models/Customer');
const connectDB = require('./config/databaseConnection');
const authenticateToken = require('./middleware/authenticateToken');
require('dotenv').config();

const app = express();
connectDB();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: ['http://localhost:5173', 'https://khaata-app.vercel.app', '*'],
  optionsSuccessStatus: 200,
   credentials: true,
    methods:["GET","PUT","PATCH","POST","DELETE" ],
 
};
app.options("", cors(corsOptions));
app.use(cors(corsOptions));
app.use(express.json());




app.post("/auth/login", async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Efficient query with indexing
    const user = await User.findOne({ username }).select('+password');
    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate JWT token efficiently
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '24h' }
    );

    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (err) {
    console.error('Login error:', err); // Log detailed error
    return res.status(500).json({ error: 'Server error' });
  }
})




app.post("/auth/signup" ,async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Check for existing user
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Create and save the new user efficiently
    const newUser = new User({ username, password });
    await newUser.save();

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err); // Log detailed error
    return res.status(500).json({ error: 'Server error' });
  }
})



app.post('/customers', authenticateToken,  async (req, res) => {
  const { name, phone } = req.body;
  const userId = req.user.id; 

  try {
    const newCustomer = new Customer({
      name,
      phone,
      userId,
    });

    await newCustomer.save();
    res.status(201).json(newCustomer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/allcustomers', authenticateToken, async (req, res) => {
  const userId = req.user.id; 

  try {
    const customers = await Customer.find({ userId });
    res.status(200).json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




app.post('/transactions/:id', authenticateToken, async (req, res) => {
  const customerId = req.params.id; 
  const { amount, type, details } = req.body; 

  try {
    const customer = await Customer.findById(customerId);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    const newTransaction = { amount, type, details };
    customer.transactions.push(newTransaction);

    if (type === 'give') {
      customer.totalGive += amount;
    } else {
      customer.totalGet += amount;
    }

    await customer.save();
    res.status(200).json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get('/customer/:id', authenticateToken, async (req, res) => {

  const {id} = req.params;
  try {
    const data = await Customer.findById(id)
    res.status(200).json({
        status: 'success get data by id',
        data: data
    })
    console.log(data)
} catch (error) {
    res.status(500).json({
        status: 'failed',
        data:"internal error"
    }) 
}
});




// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api', require('./routes/customerRoutes'));

app.get("/api", (req, res) => {
  res.status(200).send("Welcome to Khata API");
});
  
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

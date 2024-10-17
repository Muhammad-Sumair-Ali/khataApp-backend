const Customer = require('../models/Customer');


// Add a transaction
exports.addTransaction = async (req, res) => {
  const customerId = req.params.id; // Get customerId from URL params
  const { amount, type, details } = req.body; // Get amount, type, and details from body

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
};


// Get all customers
// Get all customers for the logged-in user
exports.getCustomers = async (req, res) => {
  const userId = req.user.id; // Get the logged-in user's ID

  try {
    const customers = await Customer.find({ userId }); // Fetch customers associated with the user
    res.status(200).json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Add a customer for the logged-in user
exports.addCustomer = async (req, res) => {
  const { name, phone } = req.body;
  const userId = req.user.id; // Assuming JWT stores the user's ID in req.user

  try {
    const newCustomer = new Customer({
      name,
      phone,
      userId, // Associate the customer with the logged-in user
    });

    await newCustomer.save();
    res.status(201).json(newCustomer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSingleCustomers = async (req, res) => {

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
};
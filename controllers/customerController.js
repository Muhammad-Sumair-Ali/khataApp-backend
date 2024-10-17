const Customer = require('../models/Customer');



exports.addTransaction = async (req, res) => {
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
};


exports.getCustomers = async (req, res) => {
  const userId = req.user.id; 

  try {
    const customers = await Customer.find({ userId });
    res.status(200).json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.addCustomer = async (req, res) => {
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
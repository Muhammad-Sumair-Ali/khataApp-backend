const express = require('express');
const { addCustomer, getCustomers, addTransaction ,getSingleCustomers} = require('../controllers/customerController');
const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router();


router.post('/customers', authenticateToken, addCustomer);

router.get('/allcustomers', authenticateToken, getCustomers);

router.post('/transactions/:id', authenticateToken, addTransaction);
router.get('/customer/:id', authenticateToken, getSingleCustomers);

module.exports = router;

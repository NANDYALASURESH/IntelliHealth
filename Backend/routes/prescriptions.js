const express = require('express');
const router = express.Router();
const Prescription = require('../models/Prescription');
const { protect } = require('../middleware/auth');
const { formatResponse } = require('../utils/responseFormatter');

router.use(protect);

router.get('/', async (req, res) => {
  const items = await Prescription.find().limit(50);
  res.json(formatResponse(true, 'Prescriptions', { items }));
});

module.exports = router;



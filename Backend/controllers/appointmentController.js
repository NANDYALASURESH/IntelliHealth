const Appointment = require('../models/Appointment');
const { formatResponse } = require('../utils/responseFormatter');

exports.list = async (req, res) => {
  try {
    const items = await Appointment.find().limit(50);
    res.json(formatResponse(true, 'Appointments', { items }));
  } catch (e) {
    res.status(500).json(formatResponse(false, 'Failed to list appointments'));
  }
};

exports.create = async (req, res) => {
  try {
    const appt = await Appointment.create(req.body);
    res.status(201).json(formatResponse(true, 'Created', { appointment: appt }));
  } catch (e) {
    res.status(400).json(formatResponse(false, e.message));
  }
};



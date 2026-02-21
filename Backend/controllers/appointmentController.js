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
    const { doctor, scheduledDate, scheduledTime, duration = 30 } = req.body;

    if (!doctor || !scheduledDate || !scheduledTime) {
      return res.status(400).json(formatResponse(false, 'Doctor, date, and time are required'));
    }

    // Parse requested appointment time
    const [hours, minutes] = scheduledTime.split(':').map(Number);
    const requestedStart = new Date(scheduledDate);
    requestedStart.setHours(hours, minutes, 0, 0);
    const requestedEnd = new Date(requestedStart.getTime() + duration * 60000);

    // Check for collisions
    // Fetch all active appointments for this doctor on this day
    const startOfDay = new Date(scheduledDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(scheduledDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingAppointments = await Appointment.find({
      doctor,
      scheduledDate: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ['scheduled', 'confirmed', 'in-progress'] }
    });

    const isCollision = existingAppointments.some(existing => {
      const [exHours, exMinutes] = existing.scheduledTime.split(':').map(Number);
      const existingStart = new Date(existing.scheduledDate);
      existingStart.setHours(exHours, exMinutes, 0, 0);
      const existingEnd = new Date(existingStart.getTime() + (existing.duration || 30) * 60000);

      // Overlap logic: NewStart < ExistingEnd && NewEnd > ExistingStart
      return requestedStart < existingEnd && requestedEnd > existingStart;
    });

    if (isCollision) {
      return res.status(409).json(formatResponse(false, 'This time slot is already booked for this doctor. Please choose another time.'));
    }

    const appt = await Appointment.create(req.body);
    res.status(201).json(formatResponse(true, 'Appointment scheduled successfully', { appointment: appt }));
  } catch (e) {
    console.error('Create appointment error:', e);
    res.status(500).json(formatResponse(false, 'Failed to schedule appointment: ' + e.message));
  }
};



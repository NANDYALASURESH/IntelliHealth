const express = require('express');
const router = express.Router();
const Prescription = require('../models/Prescription');
const { protect } = require('../middleware/auth');
const { formatResponse } = require('../utils/responseFormatter');

router.use(protect);

const {
  createPrescription,
  getPrescriptionsByPatient,
  getMyPrescriptions,
  getPrescriptionsByDoctor,
  getPrescriptionById
} = require('../controllers/prescriptionController');

router.use(protect);

router.post('/', createPrescription);
router.get('/my', getMyPrescriptions);
router.get('/doctor/me', getPrescriptionsByDoctor);
router.get('/patient/:patientId', getPrescriptionsByPatient);
router.get('/:id', getPrescriptionById);

module.exports = router;



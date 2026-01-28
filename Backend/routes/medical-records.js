const express = require('express');
const router = express.Router();
const {
    createRecord,
    getRecordsByPatient,
    getMyRecords,
    getRecordsByDoctor,
    getRecordById
} = require('../controllers/recordController');

const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', createRecord);
router.get('/my', getMyRecords);
router.get('/doctor/me', getRecordsByDoctor);
router.get('/patient/:patientId', getRecordsByPatient);
router.get('/:id', getRecordById);

module.exports = router;



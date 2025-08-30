const express = require('express');
const router = express.Router();
const { list, create } = require('../controllers/appointmentController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', list);
router.post('/', create);

module.exports = router;



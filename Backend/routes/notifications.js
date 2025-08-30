const express = require('express');
const router = express.Router();
const { list } = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', list);

module.exports = router;



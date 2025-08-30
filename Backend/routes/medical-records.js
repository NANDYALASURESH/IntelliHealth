const express = require('express');
const router = express.Router();
const { list } = require('../controllers/recordController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', list);

module.exports = router;



const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    sendMessage,
    getInbox,
    getConversation
} = require('../controllers/messageController');

router.use(protect);

router.post('/', sendMessage);
router.get('/inbox', getInbox);
router.get('/conversation/:userId', getConversation);

module.exports = router;

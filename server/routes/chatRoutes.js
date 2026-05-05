const express = require('express');
const router = express.Router();
// Removed verifyAuth to allow bot to work on landing/login pages
const { handleChatQuery } = require('../controllers/chatController');

router.post('/', handleChatQuery);

module.exports = router;

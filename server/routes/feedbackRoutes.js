const express = require('express');
const router = express.Router();
const verifyAuth = require('../middlewares/authMiddleware');
const { submitFeedback, getUserFeedback } = require('../controllers/feedbackController');

router.post('/', verifyAuth, submitFeedback);
router.get('/', verifyAuth, getUserFeedback);

module.exports = router;

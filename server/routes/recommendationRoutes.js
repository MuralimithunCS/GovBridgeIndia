const express = require('express');
const router = express.Router();
const verifyAuth = require('../middlewares/authMiddleware');
const { getRecommendations } = require('../controllers/recommendationController');

router.get('/', verifyAuth, getRecommendations);

module.exports = router;

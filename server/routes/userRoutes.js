const express = require('express');
const router = express.Router();
const verifyAuth = require('../middlewares/authMiddleware');
const { createOrUpdateProfile, getProfile, applyForScheme } = require('../controllers/userController');

// All routes are protected by Firebase Auth middleware
router.post('/profile', verifyAuth, createOrUpdateProfile);
router.get('/profile', verifyAuth, getProfile);
router.post('/apply', verifyAuth, applyForScheme);

module.exports = router;

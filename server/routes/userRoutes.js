const express = require('express');
const router = express.Router();
const verifyAuth = require('../middlewares/authMiddleware');
const { createOrUpdateProfile, getProfile } = require('../controllers/userController');

// All routes are protected by Firebase Auth middleware
router.post('/profile', verifyAuth, createOrUpdateProfile);
router.get('/profile', verifyAuth, getProfile);

module.exports = router;

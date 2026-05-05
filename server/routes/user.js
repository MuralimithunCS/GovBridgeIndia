const express = require('express');
const router = express.Router();
const verifyAuth = require('../middlewares/authMiddleware');
const admin = require('firebase-admin');
const User = require('../models/User');

// GET /api/user/profile
router.get('/profile', verifyAuth, async (req, res) => {
  try {
    const db = admin.firestore();
    const userDoc = await db.collection('users').doc(req.user.uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json(userDoc.data());
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/user/profile
router.post('/profile', verifyAuth, async (req, res) => {
  try {
    const { name, age, gender, state, district, occupation, income, category } = req.body;

    // Basic validation
    if (!name || !age || !gender || !state || !district || !occupation || !income || !category) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const newUser = new User({
      name,
      age: Number(age),
      gender,
      state,
      district,
      occupation,
      income,
      category
    });

    const db = admin.firestore();
    await db.collection('users').doc(req.user.uid).set(newUser.toFirestore());

    res.status(201).json({ message: 'Profile created successfully', profile: newUser.toFirestore() });
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

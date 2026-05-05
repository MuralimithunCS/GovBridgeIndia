const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const verifyAuth = require('../middlewares/authMiddleware');

// GET /api/schemes
router.get('/', async (req, res) => {
  try {
    const db = admin.firestore();
    const snapshot = await db.collection('schemes').get();
    const schemes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(schemes);
  } catch (error) {
    console.error('Error fetching schemes:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/schemes/:id
router.get('/:id', async (req, res) => {
  try {
    const db = admin.firestore();
    const doc = await db.collection('schemes').doc(req.params.id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Scheme not found' });
    }
    
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error fetching scheme:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/schemes (admin placeholder)
router.post('/', verifyAuth, async (req, res) => {
  try {
    // In a real app, you would verify if req.user is an admin
    const newScheme = req.body;
    newScheme.createdAt = new Date().toISOString();
    
    const db = admin.firestore();
    const docRef = await db.collection('schemes').add(newScheme);
    
    res.status(201).json({ id: docRef.id, ...newScheme });
  } catch (error) {
    console.error('Error creating scheme:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

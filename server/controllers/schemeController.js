const { db } = require('../config/firebaseAdmin');

// @desc    Get all schemes
// @route   GET /api/schemes
// @access  Public
exports.getAllSchemes = async (req, res) => {
  try {
    const { category, state, type } = req.query;
    let schemesRef = db.collection('schemes');
    let query = schemesRef;

    if (category) {
      query = query.where('category', '==', category);
    }
    
    if (type) {
      query = query.where('type', '==', type);
    }

    const snapshot = await query.get();
    let schemes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Post-filter for state since Firestore doesn't support $in with 'all' easily in one where
    if (state) {
      schemes = schemes.filter(s => 
        s.state_applicable === state || 
        s.state_applicable?.toLowerCase() === 'all'
      );
    }

    res.json(schemes);
  } catch (error) {
    console.error('Error in getAllSchemes:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get single scheme
// @route   GET /api/schemes/:id
// @access  Public
exports.getSchemeById = async (req, res) => {
  try {
    const doc = await db.collection('schemes').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Scheme not found' });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error in getSchemeById:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Create a scheme (admin placeholder)
// @route   POST /api/schemes
// @access  Public (for now)
exports.createScheme = async (req, res) => {
  try {
    const docRef = await db.collection('schemes').add(req.body);
    const newDoc = await docRef.get();
    res.status(201).json({ id: newDoc.id, ...newDoc.data() });
  } catch (error) {
    console.error('Error in createScheme:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

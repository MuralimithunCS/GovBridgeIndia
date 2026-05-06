const { db } = require('../config/firebaseAdmin');

// @desc    Create or update user profile
// @route   POST /api/user/profile
// @access  Private
exports.createOrUpdateProfile = async (req, res) => {
  try {
    const { 
      name, age, gender, state, district, occupation, income, 
      category, education, disability, marital_status, rural_urban 
    } = req.body;
    
    const firebase_uid = req.user.uid;
    const userRef = db.collection('users').doc(firebase_uid);

    const profileData = {
      firebase_uid,
      name, age, gender, state, district, occupation, income, 
      category, education, disability, marital_status, rural_urban,
      updatedAt: new Date().toISOString()
    };

    await userRef.set(profileData, { merge: true });
    
    const updatedDoc = await userRef.get();
    res.json({ message: 'Profile saved successfully', user: updatedDoc.data() });

  } catch (error) {
    console.error('Error in createOrUpdateProfile:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const doc = await db.collection('users').doc(req.user.uid).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json(doc.data());
  } catch (error) {
    console.error('Error in getProfile:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

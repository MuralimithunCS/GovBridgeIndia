const { db } = require('../config/firebaseAdmin');
const matchSchemes = require('../utils/matchEngine');

// @desc    Get personalized scheme recommendations
// @route   GET /api/recommendations
// @access  Private
exports.getRecommendations = async (req, res) => {
  try {
    const firebase_uid = req.user.uid;
    
    // 1. Fetch user profile from Firestore
    const userDoc = await db.collection('users').doc(firebase_uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User profile not found. Please complete your profile first.' });
    }
    const user = userDoc.data();

    // 2. Fetch all schemes from Firestore
    const schemesSnapshot = await db.collection('schemes').get();
    const schemes = schemesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // 3. Match
    const recommendations = matchSchemes(user, schemes);

    // 4. Return top recommendations
    res.json({
      recommendations: recommendations.slice(0, 15)
    });

  } catch (error) {
    console.error('Error in getRecommendations:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

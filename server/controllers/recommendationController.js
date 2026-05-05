const User = require('../models/User');
const Scheme = require('../models/Scheme');
const matchSchemes = require('../utils/matchEngine');

// @desc    Get personalized scheme recommendations
// @route   GET /api/recommendations
// @access  Private
exports.getRecommendations = async (req, res) => {
  try {
    const firebase_uid = req.user.uid;
    
    // 1. Fetch user profile
    const user = await User.findOne({ firebase_uid });
    if (!user) {
      return res.status(404).json({ error: 'User profile not found. Please complete your profile first.' });
    }

    // 2. Fetch all schemes
    const schemes = await Scheme.find({});

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

const User = require('../models/User');

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

    let user = await User.findOne({ firebase_uid });

    if (user) {
      // Update
      user = await User.findOneAndUpdate(
        { firebase_uid },
        { $set: { 
            name, age, gender, state, district, occupation, income, 
            category, education, disability, marital_status, rural_urban 
          } 
        },
        { new: true }
      );
      return res.json({ message: 'Profile updated successfully', user });
    }

    // Create
    user = new User({
      firebase_uid,
      name, age, gender, state, district, occupation, income, 
      category, education, disability, marital_status, rural_urban
    });

    await user.save();
    res.status(201).json({ message: 'Profile created successfully', user });

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
    const user = await User.findOne({ firebase_uid: req.user.uid });

    if (!user) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error in getProfile:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

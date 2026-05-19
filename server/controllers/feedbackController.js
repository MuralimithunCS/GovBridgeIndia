const { db } = require('../config/firebaseAdmin');

// @desc    Submit user feedback/support request
// @route   POST /api/feedback
// @access  Private
exports.submitFeedback = async (req, res) => {
  try {
    const { name, email, message, type } = req.body;
    const firebase_uid = req.user.uid;
    
    const feedbackData = {
      firebase_uid,
      name,
      email,
      message,
      type: type || 'support',
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    await db.collection('feedback').add(feedbackData);
    
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Error in submitFeedback:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get user's previous feedback
// @route   GET /api/feedback
// @access  Private
exports.getUserFeedback = async (req, res) => {
  try {
    const firebase_uid = req.user.uid;
    const snapshot = await db.collection('feedback')
      .where('firebase_uid', '==', firebase_uid)
      .orderBy('createdAt', 'desc')
      .get();

    const feedback = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(feedback);
  } catch (error) {
    console.error('Error in getUserFeedback:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

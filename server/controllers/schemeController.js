const Scheme = require('../models/Scheme');

// @desc    Get all schemes
// @route   GET /api/schemes
// @access  Public
exports.getAllSchemes = async (req, res) => {
  try {
    const { category, state, type } = req.query;
    let query = {};

    if (category) query.category = category;
    if (state) query.state_applicable = { $in: [state, 'all', 'All'] };
    if (type) query.type = type;

    const schemes = await Scheme.find(query).sort({ createdAt: -1 });
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
    const scheme = await Scheme.findById(req.params.id);
    if (!scheme) {
      return res.status(404).json({ error: 'Scheme not found' });
    }
    res.json(scheme);
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
    const scheme = new Scheme(req.body);
    await scheme.save();
    res.status(201).json(scheme);
  } catch (error) {
    console.error('Error in createScheme:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

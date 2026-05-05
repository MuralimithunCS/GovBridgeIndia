const Scheme = require('../models/Scheme');
const User = require('../models/User');

exports.handleChatQuery = async (req, res) => {
  try {
    const { query } = req.body;
    const lowQuery = query.toLowerCase();

    // 1. Handle Greetings
    const greetings = ['hi', 'hello', 'hey', 'namaste', 'hloo', 'hiii', 'hi bot'];
    if (greetings.includes(lowQuery.trim())) {
      return res.json({
        message: "Namaste! I am **GovBot**, your personal government schemes assistant. You can ask me about 'schemes for farmers', 'student scholarships', or specific programs like 'PM Kisan'."
      });
    }

    // 2. Check if user is asking about a specific scheme
    const allSchemes = await Scheme.find({});
    const specificScheme = allSchemes.find(s => lowQuery.includes(s.name.toLowerCase()));

    if (specificScheme && (lowQuery.includes('what') || lowQuery.includes('tell') || lowQuery.includes('details'))) {
      return res.json({
        message: `Sure! **${specificScheme.name}** is a ${specificScheme.type} scheme.`,
        details: {
          description: specificScheme.description,
          benefits: specificScheme.benefits,
          apply_link: specificScheme.apply_link,
          id: specificScheme._id
        }
      });
    }

    // 3. Keyword-based Recommendation Logic
    let filter = {};
    if (lowQuery.includes('farmer') || lowQuery.includes('kisan')) filter.category = 'farmer';
    if (lowQuery.includes('student') || lowQuery.includes('scholarship') || lowQuery.includes('education')) filter.category = 'student';
    if (lowQuery.includes('women') || lowQuery.includes('girl') || lowQuery.includes('female')) filter.category = 'women';
    if (lowQuery.includes('business') || lowQuery.includes('startup') || lowQuery.includes('loan')) filter.category = 'business';
    if (lowQuery.includes('health') || lowQuery.includes('medical') || lowQuery.includes('hospital')) filter.category = 'healthcare';

    // State filtering
    const states = ['maharashtra', 'telangana', 'karnataka', 'tamil nadu', 'kerala', 'uttar pradesh', 'rajasthan', 'madhya pradesh'];
    const foundState = states.find(s => lowQuery.includes(s));
    if (foundState) {
      filter.$or = [
        { state_applicable: { $regex: new RegExp(foundState, 'i') } },
        { state_applicable: { $regex: /all/i } }
      ];
    }

    const matchedSchemes = await Scheme.find(filter).sort({ state_applicable: -1 }).limit(5);

    if (matchedSchemes.length > 0 && filter.category) {
      return res.json({
        message: `I found **${matchedSchemes.length} schemes** for ${filter.category} that might interest you:`,
        schemes: matchedSchemes.map(s => ({
          id: s._id,
          name: s.name,
          category: s.category,
          benefit: s.benefits?.substring(0, 80) + '...'
        }))
      });
    }

    // 4. Fallback
    res.json({
      message: "I'm here to help! Try asking about 'schemes for farmers', 'scholarships', or specific schemes like 'PM Kisan'. You can also ask me about benefits in specific states."
    });

  } catch (error) {
    console.error('Chat Error:', error.message);
    res.status(500).json({ error: 'GovBot is temporarily offline.' });
  }
};

const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  type: {
    type: String,
    enum: ['central', 'state'],
    required: true
  },
  state_applicable: {
    type: String,
    default: 'all'
  },
  category: {
    type: String,
    required: true
  },
  eligibility_rules: {
    type: Object,
    default: {}
  },
  benefits: String,
  documents: [String],
  apply_link: String,
  deadline: Date
}, { timestamps: true });

module.exports = mongoose.model('Scheme', schemeSchema);

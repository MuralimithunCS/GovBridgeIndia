const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firebase_uid: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  age: Number,
  gender: String,
  state: String,
  district: String,
  occupation: String,
  income: String,
  category: String,
  education: String,
  disability: String,
  marital_status: String,
  rural_urban: String
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

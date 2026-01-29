const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'analyst', 'viewer'], 
    default: 'viewer' 
  },
  
  requestedRole: {
    type: String,
    enum: ['analyst', 'admin', null],
    default: null
  }
});

module.exports = mongoose.model('User', UserSchema);
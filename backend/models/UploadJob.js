const mongoose = require('mongoose');

const UploadJobSchema = new mongoose.Schema({
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fileName: String,
  status: { 
    type: String, 
    enum: ['Processing', 'Completed', 'Failed'], 
    default: 'Processing' 
  },
  totalRecords: { type: Number, default: 0 },
  matchedCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UploadJob', UploadJobSchema);
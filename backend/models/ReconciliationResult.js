const mongoose = require('mongoose');

const ReconciliationResultSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'UploadJob', index: true }, 
  uploadedId: String,
  uploadedAmount: Number,
  systemId: String, 
  systemAmount: Number,
  variance: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['Matched', 'Partial Match', 'Unmatched', 'Duplicate'] 
  },
  isResolved: { type: Boolean, default: false }
});

module.exports = mongoose.model('ReconciliationResult', ReconciliationResultSchema);
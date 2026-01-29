const mongoose = require('mongoose');

const SystemRecordSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, unique: true, index: true }, 
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  referenceNumber: { type: String, index: true }, 
  status: { type: String, default: 'Settled' }
});

module.exports = mongoose.model('SystemRecord', SystemRecordSchema);
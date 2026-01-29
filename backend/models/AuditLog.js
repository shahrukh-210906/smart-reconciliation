const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  entity: String, 
  entityId: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: String, 
  oldValue: mongoose.Schema.Types.Mixed,
  newValue: mongoose.Schema.Types.Mixed,
  timestamp: { type: Date, default: Date.now, immutable: true } 
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);
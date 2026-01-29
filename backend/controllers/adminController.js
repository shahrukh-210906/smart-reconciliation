const fs = require('fs');
const csv = require('csv-parser');
const User = require('../models/User');
const UploadJob = require('../models/UploadJob');
const AuditLog = require('../models/AuditLog');
const SystemRecord = require('../models/SystemRecord');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
};

exports.approveRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    if (!user.requestedRole) {
      return res.status(400).json({ msg: 'No pending role request for this user' });
    }

    user.role = user.requestedRole;
    user.requestedRole = null; 
    await user.save();

    res.json({ msg: `User promoted to ${user.role}`, user });
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
};

exports.rejectRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    user.requestedRole = null; 
    await user.save();
    res.json({ msg: 'Role request rejected' });
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
};

exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await UploadJob.find()
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
};

exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate('user', 'name email role')
      .sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
};

exports.uploadSystemRecords = async (req, res) => {
  if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });

  const records = [];
  try {
    await SystemRecord.deleteMany({});

    const stream = fs.createReadStream(req.file.path).pipe(csv({
      mapHeaders: ({ header }) => header.trim()
    }));

    for await (const row of stream) {
      const txnId = row['TransactionID'] || row['Transaction ID'];
      const amt = row['Amount'];
      
      if (txnId && amt) {
        records.push({
          transactionId: txnId,
          amount: parseFloat(amt),
          date: row['Date'] ? new Date(row['Date']) : new Date(),
          referenceNumber: row['ReferenceNo'] || row['Reference Number']
        });
      }
    }

    await SystemRecord.insertMany(records);

    await AuditLog.create({
      entity: 'SystemRecord',
      user: req.user.id,
      action: 'System Data Update',
      details: `Replaced System Records. Imported ${records.length} entries.`,
      timestamp: new Date()
    });

    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

    res.json({ msg: `Successfully imported ${records.length} system records.` });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Upload failed' });
  }
};
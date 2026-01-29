const fs = require('fs');
const csv = require('csv-parser');
const SystemRecord = require('../models/SystemRecord');
const ReconciliationResult = require('../models/ReconciliationResult');
const UploadJob = require('../models/UploadJob');
const AuditLog = require('../models/AuditLog');

const determineStatus = (uploaded, system) => {
  if (!system) return 'Unmatched';

  const upAmt = parseFloat(uploaded.uploadedAmount);
  const sysAmt = parseFloat(system.amount);

  if (upAmt === sysAmt) return 'Matched';

  const variance = Math.abs(upAmt - sysAmt);
  const percentageDiff = (variance / sysAmt) * 100;
  
  if (percentageDiff <= 2) return 'Partial Match';

  return 'Unmatched'; 
};

const processFileAsync = async (jobId, filePath, mapping) => {
  const results = [];
  const seenIds = new Set();
  
  try {
    const systemRecords = await SystemRecord.find({});
    const sysMap = new Map(systemRecords.map(rec => [rec.transactionId, rec]));
    const refMap = new Map(systemRecords.map(rec => [rec.referenceNumber, rec]));

    const stream = fs.createReadStream(filePath).pipe(csv({
      mapHeaders: ({ header }) => header.trim()
    }));

    for await (const row of stream) {
      const upId = row[mapping.transactionId]?.trim(); 
      const rawAmt = row[mapping.amount];
      
      if (!upId) continue;

      const upAmt = parseFloat(rawAmt); 
      let status = 'Unmatched';
      let systemMatch = null;
      let variance = 0;

      if (seenIds.has(upId)) {
        status = 'Duplicate';
      } else {
        seenIds.add(upId);

        if (sysMap.has(upId)) {
          systemMatch = sysMap.get(upId);
        } else if (refMap.has(row[mapping.referenceNumber]?.trim())) {
          systemMatch = refMap.get(row[mapping.referenceNumber]?.trim());
        }

        if (systemMatch) {
          variance = upAmt - systemMatch.amount;
          status = determineStatus({ uploadedAmount: upAmt }, systemMatch);
        }
      }

      results.push({
        jobId,
        uploadedId: upId,
        uploadedAmount: isNaN(upAmt) ? 0 : upAmt,
        systemId: systemMatch ? systemMatch.transactionId : null,
        systemAmount: systemMatch ? systemMatch.amount : null,
        variance,
        status
      });
    }

    await ReconciliationResult.insertMany(results);

    await UploadJob.findByIdAndUpdate(jobId, { 
      status: 'Completed',
      totalRecords: results.length,
      matchedCount: results.filter(r => r.status === 'Matched').length
    });

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  } catch (error) {
    console.error(error);
    await UploadJob.findByIdAndUpdate(jobId, { status: 'Failed' });
  }
};

exports.uploadData = async (req, res) => {
  try {
    const existingJob = await UploadJob.findOne({
      fileName: req.file.originalname,
      status: 'Completed'
    }).sort({ createdAt: -1 });

    if (existingJob) {
      if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(200).json({ 
        msg: 'File previously processed by a user. Returning existing results.', 
        jobId: existingJob._id,
        isCached: true
      });
    }

    const job = new UploadJob({
      uploadedBy: req.user.id,
      fileName: req.file.originalname,
      status: 'Processing'
    });
    await job.save();

    await AuditLog.create({
      entity: 'UploadJob',
      entityId: job._id,
      user: req.user.id,
      action: 'File Upload',
      details: `Uploaded file: ${req.file.originalname}`,
      timestamp: new Date()
    });

    processFileAsync(job._id, req.file.path, JSON.parse(req.body.mapping));

    res.status(202).json({ msg: 'File queued for processing', jobId: job._id });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error' });
  }
};

exports.getResults = async (req, res) => {
  try {
    const results = await ReconciliationResult.find({ jobId: req.params.jobId });
    res.json(results);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.resolveRecord = async (req, res) => {
  const { id } = req.params; 
  const { newStatus } = req.body;

  try {
    const record = await ReconciliationResult.findById(id);
    const oldStatus = record.status;

    record.status = newStatus;
    record.isResolved = true;
    record.variance = 0; 
    await record.save();

    await AuditLog.create({
      entity: 'ReconciliationResult',
      entityId: id,
      user: req.user.id,
      action: 'Manual Resolution',
      oldValue: oldStatus,
      newValue: newStatus
    });

    res.json(record);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.getLatestJob = async (req, res) => {
  try {
    const latestJob = await UploadJob.findOne({ status: 'Completed' })
      .sort({ createdAt: -1 });

    if (!latestJob) {
      return res.status(404).json({ msg: 'No data found' });
    }

    res.json({ jobId: latestJob._id });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};
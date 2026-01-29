const express = require('express');
const router = express.Router();
const multer = require('multer');
const { auth, checkRole } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});
const upload = multer({ storage: storage });

router.use(auth, checkRole(['admin']));

router.get('/users', adminController.getAllUsers);
router.put('/approve-role/:id', adminController.approveRole);
router.put('/reject-role/:id', adminController.rejectRole);
router.get('/jobs', adminController.getAllJobs);
router.get('/audit-logs', adminController.getAuditLogs);
router.post('/system-upload', upload.single('file'), adminController.uploadSystemRecords);

module.exports = router;
const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const User = require('../models/User');


router.post('/request-upgrade', auth, async (req, res) => {
  const { requestedRole } = req.body; // e.g., 'analyst'

  // Validation
  const validRoles = ['analyst', 'admin'];
  if (!validRoles.includes(requestedRole)) {
    return res.status(400).json({ msg: 'Invalid role requested' });
  }

  try {
    const user = await User.findById(req.user.id);
    
    if (user.role === requestedRole) {
      return res.status(400).json({ msg: 'You already have this role' });
    }

    user.requestedRole = requestedRole;
    await user.save();

    res.json({ msg: 'Request submitted to Admin' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
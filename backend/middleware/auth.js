const jwt = require('jsonwebtoken');

// 1. Verify Token (Authentication)
const auth = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user to request object
    req.user = decoded.user; 
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// 2. Verify Role (Authorization)
const checkRole = (roles) => (req, res, next) => {
  // Debug line: Print what the server sees
  // console.log(`User Role: ${req.user.role} | Required: ${roles}`); 
  
  if (!req.user) {
    return res.status(401).json({ msg: 'User not authenticated' });
  }

  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ msg: `Access denied. Required role: ${roles.join(' or ')}` });
  }

  next();
};

module.exports = { auth, checkRole };
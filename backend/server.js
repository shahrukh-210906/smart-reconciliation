const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// ... imports for routes ...
const apiRoutes = require('./routes/api'); // Check your actual path
const adminRoutes = require('./routes/admin'); // Check your actual path

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads')); // Ensure uploads folder is accessible

// Routes
app.use('/api', apiRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;

// FIX: Connect FIRST, then Start Server
console.log("⏳ Connecting to MongoDB...");

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');

    // Only start the server if DB is ready
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
  });
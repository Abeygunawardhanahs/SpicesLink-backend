require('dotenv').config(); // ✅ Top of file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Enable CORS for all routes - UPDATED to include your frontend port
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://192.168.0.100:3000',
    'http://localhost:8081',        // ✅ Added your React Native Web port
    'http://127.0.0.1:8081',        // ✅ Added alternative localhost format
    'http://192.168.0.100:8081'     // ✅ Added your network IP with port 8081
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // ✅ Explicitly allow methods
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'] // ✅ Added common headers
}));

// Middleware for parsing JSON and URL-encoded data
app.use(express.json({ limit: '10mb' })); // Increase limit to 10MB
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`=== SERVER REQUEST ===`);
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Origin:', req.headers.origin); // ✅ Added origin logging for CORS debugging
  console.log('Headers:', req.headers);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', req.body);
  }
  next();
});

// Routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// Test route to verify server is working
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Server is working!', 
    timestamp: new Date().toISOString(),
    cors: 'CORS configured for React Native Web' // ✅ Added CORS confirmation
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('=== SERVER ERROR ===');
  console.error('Error:', error);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ message: 'Route not found' });
});

// Debug MongoDB connection
console.log('=== SERVER STARTUP ===');
console.log('Node Environment:', process.env.NODE_ENV);
console.log('Loaded MONGO_URI:', process.env.MONGO_URI ? 'Present' : 'Missing');
console.log('Port:', process.env.PORT || 5000);
console.log('✅ CORS enabled for ports: 3000, 8081 (React Native Web)'); // ✅ Added CORS confirmation

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected successfully');
  
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, '0.0.0.0', () => { // ✅ Added '0.0.0.0' to listen on all interfaces
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`✅ Server URL: http://localhost:${PORT}`);
    console.log(`✅ Network URL: http://192.168.0.100:${PORT}`); // ✅ Added network URL
    console.log(`✅ API Base URL: http://localhost:${PORT}/api`);
    console.log(`✅ CORS configured for React Native Web on port 8081`); // ✅ Added confirmation
  });
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error('❌ Unhandled Promise Rejection:', err.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  process.exit(1);
});
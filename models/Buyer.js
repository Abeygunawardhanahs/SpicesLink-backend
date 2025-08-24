const mongoose = require('mongoose');

// Buyer schema that matches your frontend form and controller expectations
const buyerSchema = new mongoose.Schema({
  shopName: {
    type: String,
    required: [true, 'Shop name is required'],
    trim: true
  },
  shopOwnerName: {
    type: String,
    required: [true, 'Owner name is required'],
    trim: true
  },
  shopLocation: {
    type: String,
    required: [true, 'Shop location is required'],
    trim: true
  },
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required'],
    validate: {
      validator: function(v) {
        // Simple validation for 10 to 15 digits
        return /\d{10,15}/.test(v);
      },
      message: 'Contact number must be between 10 and 15 digits.'
    }
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
      },
      message: 'Please enter a valid email address.'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  // --- Standard fields for user management ---
  lastLogin: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  // Adds createdAt and updatedAt timestamps automatically
  timestamps: true
});

// FIXED: Index for faster queries - corrected field names
//buyerSchema.index({ email: 1 });        // ← Changed from 'emailAddress' to 'email'
buyerSchema.index({ shopLocation: 1 });

module.exports = mongoose.model('Buyer', buyerSchema);
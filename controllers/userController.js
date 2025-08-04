const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register Buyer
exports.registerBuyer = async (req, res) => {
  try {
    const {
      shopName,
      shopOwnerName,
      shopLocation,
      contactNumber,
      emailAddress,
      password,
    } = req.body;

    const existingUser = await User.findOne({ emailAddress });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const buyer = new User({
      role: 'Buyer',
      shopName,
      shopOwnerName,
      shopLocation,
      contactNumber,
      emailAddress,
      password: hashedPassword,
    });

    await buyer.save();
    res.status(201).json({ message: 'Buyer registered successfully', user: buyer });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Buyer Login
exports.loginBuyer = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const user = await User.findOne({
      emailAddress: email.toLowerCase(),
      role: 'Buyer'
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        emailAddress: user.emailAddress,
        role: user.role,
        shopOwnerName: user.shopOwnerName
      },
      process.env.JWT_SECRET || 'spiceslink-secret-key',
      { expiresIn: '7d' }
    );

    await User.findByIdAndUpdate(user._id, {
      lastLogin: new Date()
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          shopOwnerName: user.shopOwnerName,
          shopName: user.shopName,
          emailAddress: user.emailAddress,
          role: user.role,
          contactNumber: user.contactNumber,
          shopLocation: user.shopLocation
        }
      }
    });

  } catch (error) {
    console.error('Buyer login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
};

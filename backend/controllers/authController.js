
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

const validatePassword = (password) => {
    return password && password.length >= 6;
};

const registerUser = async (req, res) => {
    const { name, email, password, phoneNumber } = req.body;
    
    try {
        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (name.trim().length < 2) {
            return res.status(400).json({ message: 'Name must be at least 2 characters' });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        if (!validatePassword(password)) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email: email.toLowerCase() });
        if (userExists) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Create user
        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase(),
            password: password,
            phoneNumber: phoneNumber || undefined,
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            id: user._id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber || '',
            token: token,
            message: 'Registration successful'
        });
    } catch (error) {
        console.error('Registration error:', error);
        
        // MongoDB duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Validation error
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: messages[0] || 'Validation error' });
        }

        res.status(500).json({ message: 'Registration failed. Please try again.' });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = generateToken(user._id);
        
        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber || '',
            token: token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed. Please try again.' });
    }
};

const getProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({
        id: user._id,
        name: user.name,
        email: user.email,
        university: user.university,
        address: user.address,
        phoneNumber: user.phoneNumber || '',
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { name, email, university, address, phoneNumber } = req.body;
        
        // Validate updates
        if (name !== undefined) {
            if (name.trim().length < 2) {
                return res.status(400).json({ message: 'Name must be at least 2 characters' });
            }
            user.name = name.trim();
        }

        if (email !== undefined && email !== user.email) {
            if (!validateEmail(email)) {
                return res.status(400).json({ message: 'Invalid email format' });
            }
            const emailExists = await User.findOne({ email: email.toLowerCase(), _id: { $ne: user._id } });
            if (emailExists) {
                return res.status(400).json({ message: 'Email already in use' });
            }
            user.email = email.toLowerCase();
        }

        if (university !== undefined) user.university = university;
        if (address !== undefined) user.address = address;
        if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;

        if (!user.phoneNumber || String(user.phoneNumber).trim().length === 0) {
            return res.status(400).json({ message: 'Phone number is required' });
        }

        const updatedUser = await user.save();
        const token = generateToken(updatedUser._id);
        
        res.json({
            id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            university: updatedUser.university,
            address: updatedUser.address,
            phoneNumber: updatedUser.phoneNumber || '',
            token: token
        });
    } catch (error) {
        console.error('Profile update error:', error);
        
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        res.status(500).json({ message: 'Failed to update profile' });
    }
};

module.exports = { registerUser, loginUser, updateUserProfile, getProfile };

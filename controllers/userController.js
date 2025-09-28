import User from '../models/User.js';
import bcrypt from 'bcryptjs';

/**
 * @desc    Create a new user with the 'Mechanic' role
 * @route   POST /api/users/mechanics
 * @access  Private (Manager)
 */
export const createMechanic = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password.' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'A user with this email already exists.' });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const mechanic = new User({
      name,
      email,
      password: hashedPassword,
      role: 'Mechanic', // Explicitly set the role
    });

    const createdMechanic = await mechanic.save();

    // Do not send the password back
    const mechanicToReturn = {
        _id: createdMechanic._id,
        name: createdMechanic.name,
        email: createdMechanic.email,
        role: createdMechanic.role,
    };

    res.status(201).json(mechanicToReturn);
  } catch (error) {
    console.error('Error creating mechanic:', error);
    res.status(500).json({ message: 'Server error while creating mechanic.' });
  }
};

/**
 * @desc    Get all users (for administrative purposes)
 * @route   GET /api/users
 * @access  Private (Manager)
 */
export const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @desc    Get all users with the 'Mechanic' role
 * @route   GET /api/users/mechanics
 * @access  Private (Manager)
 */
export const getMechanics = async (req, res) => {
    try {
        // Find all users where the role is 'Mechanic' and exclude their passwords
        const mechanics = await User.find({ role: 'Mechanic' }).select('-password');
        res.json(mechanics);
    } catch (error) {
        console.error('Error fetching mechanics:', error);
        res.status(500).json({ message: 'Server error while fetching mechanics.' });
    }
};


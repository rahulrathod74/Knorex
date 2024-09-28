// controllers/userController.js
import User from '../models/User.js';
import { Parser } from 'json2csv'; // CSV parser

// Fetch all users (excluding deleted)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ deleted: false });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add new user
export const createUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const newUser = new User({ firstName, lastName, email, password });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Soft delete user by ID
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndUpdate(id, { deleted: true });
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Export users as CSV
export const exportUsers = async (req, res) => {
  try {
    const users = await User.find({ deleted: false });
    const json2csv = new Parser({ fields: ['firstName', 'lastName', 'email'] });
    const csv = json2csv.parse(users);
    res.header('Content-Type', 'text/csv');
    res.attachment('users.csv');
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

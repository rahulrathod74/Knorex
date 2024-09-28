// routes/userRoutes.js
import express from 'express';
import {
  getUsers,
  createUser,
  deleteUser,
  exportUsers
} from '../controllers/userController.js';

const router = expres




router.get('/', getUsers);
router.post('/', createUser);
router.delete('/:id', deleteUser);
router.get('/export', exportUsers);

export default router;

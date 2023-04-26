import express from 'express';
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  getNotifications,
} from '../controllers/users.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

// READ
router.get('/:id', verifyToken, getUser);
router.get('/:id/friends', verifyToken, getUserFriends);
router.get('/notifications/:userId', verifyToken, getNotifications);

// UPDATE
router.patch('/:id/:friendId', verifyToken, addRemoveFriend);

export default router;

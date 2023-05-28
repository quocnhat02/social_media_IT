import express from 'express';
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  getNotifications,
  getAllUsers,
  sendAutomatedEmail,
  forgotPassword,
  resetPassword,
  changePassword,
  updateNotification,
} from '../controllers/users.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

// READ
router.get('/:id', verifyToken, getUser);
router.get('/:id/friends', verifyToken, getUserFriends);
router.get('/notifications/:userId', verifyToken, getNotifications);

// SEARCH CHAT
router.get('/', verifyToken, getAllUsers);

// SEND EMAIL
router.post('/sendAutomatedEmail', verifyToken, sendAutomatedEmail);

// FORGOT PASSWORD
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:resetToken', resetPassword);

// CHANGE PASSWORD
router.patch('/changePassword', verifyToken, changePassword);

// UPDATE NOTIFICATION
router.patch('/updateNotification', verifyToken, updateNotification);

// LOGIN WITH CODE
// router.post('/sendLoginCode/:email', sendLoginCode);

// UPDATE
router.patch('/:id/:friendId', verifyToken, addRemoveFriend);

export default router;

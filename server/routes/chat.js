import express from 'express';
import { verifyToken } from '../middlewares/auth.js';
import {
  accessChat,
  addToGroupChat,
  createGroupChat,
  fetchChats,
  removeFromGroupChat,
  renameGroupChat,
} from '../controllers/chat.js';

const router = express.Router();

router.route('/').post(verifyToken, accessChat);
router.route('/').get(verifyToken, fetchChats);
router.route('/group').post(verifyToken, createGroupChat);
router.route('/group-rename').put(verifyToken, renameGroupChat);
router.route('/group-add').put(verifyToken, addToGroupChat);
router.route('/group-remove').put(verifyToken, removeFromGroupChat);

export default router;

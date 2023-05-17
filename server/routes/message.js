import express from 'express';
import { verifyToken } from '../middlewares/auth.js';
import { getAllMessage, sendMessage } from '../controllers/message.js';

const router = express.Router();

router.route('/').post(verifyToken, sendMessage);
router.route('/:chatId').get(verifyToken, getAllMessage);

export default router;

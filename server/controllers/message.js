import asyncHandler from 'express-async-handler';
import { Message } from '../models/Message.js';
import User from '../models/User.js';
import { Chat } from '../models/Chat.js';

export const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log('Invalid data passed into request');
    return res.sendStatus(400);
  }

  let newMessage = {
    sender: req.user._id,
    content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate(
      'sender',
      'firstName lastName picturePath'
    );
    message = await message.populate('chat');
    message = await User.populate(message, {
      path: 'chat.users',
      select: 'firstName lastName picturePath email',
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const getAllMessage = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate('sender', 'firstName lastName picturePath email')
      .populate('chat');

    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

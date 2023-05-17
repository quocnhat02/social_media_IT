import jwt from 'jsonwebtoken';
import User from '../models/User.js';

import asyncHandler from 'express-async-handler';

export const verifyToken = asyncHandler(async (req, res, next) => {
  try {
    let token = req.header('Authorization');

    if (!token) {
      return res.status(403).send('Access Denied');
    }

    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // req.user = verified;
    req.user = await User.findById(verified.id).select('-password');

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

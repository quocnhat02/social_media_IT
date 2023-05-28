import User from '../models/User.js';
import Notification from '../models/Notification.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import asyncHandler from 'express-async-handler';
import sendEmail from '../utils/sendEmail.js';

// import Cryptr from 'cryptr';

// const cryptr = new Cryptr('mynameisnhat');

// READ
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );

    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// UPDATE
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }

    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );

    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// GET Notifications
export const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({
      user: userId,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// GET SEARCH CHAT
export const getAllUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { firstName: { $regex: req.query.search, $options: 'i' } },
          { lastName: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({
    _id: { $ne: req.user._id },
  });

  res.send(users);
});

export const sendAutomatedEmail = asyncHandler(async (req, res) => {
  const { subject, send_to, reply_to, template, url } = req.body;

  if (!subject || !send_to || !reply_to || !template) {
    return res.status(500).json({
      success: false,
      message: 'Missing email parameter',
    });
  }

  // Get user
  const user = await User.findOne({ email: send_to });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  const send_from = process.env.EMAIL_USER;
  const name = `${user.lastName} ${user.firstName}`;
  const link = `${process.env.FRONTEND_URL}/${url}`;

  try {
    await sendEmail(
      subject,
      send_to,
      send_from,
      reply_to,
      template,
      name,
      link
    );

    return res.status(200).json({
      success: true,
      message: 'Email sent',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Email not sent, please try again',
    });
  }
});

// FORGOT PASSWORD
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'No user with this email',
    });
  }

  //const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  const resetUrl = `${process.env.FRONTEND_URL}/resetPassword/${user._id}`;

  // Send Email
  const subject = 'Password Reset Request - SOCIAL-MEDIA-IT';
  const send_to = user.email;
  const sent_from = process.env.EMAIL_USER;
  const reply_to = 'noreply@nhat.com';
  const template = 'forgotPassword';
  const name = `${user.lastName} ${user.firstName}`;
  const link = resetUrl;

  try {
    await sendEmail(
      subject,
      send_to,
      sent_from,
      reply_to,
      template,
      name,
      link
    );
    return res.status(200).json({
      success: true,
      message: 'Password Reset Email Sent',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Email not sent, please try again',
    });
  }
});

// RESET PASSWORD
export const resetPassword = asyncHandler(async (req, res) => {
  const { resetToken } = req.params;
  const { password } = req.body;

  const user = await User.findById(resetToken);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);

  user.password = passwordHash;
  await user.save();

  return res.status(200).json({
    success: true,
    message: 'Password reset successful',
  });
});

// CHANGE PASSWORD
export const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, password } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  if (!oldPassword || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please enter old and new password',
    });
  }

  // Check if old password is correct
  const isMatch = await bcrypt.compare(oldPassword, user.password);

  if (!isMatch) {
    return res.status(403).json({
      success: false,
      message: 'Old password is not match',
    });
  }

  // Save new password
  if (user) {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    user.password = passwordHash;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password change successful' + password,
    });
  } else {
    return res.status(400).json({
      success: false,
      message: 'Old password is incorrect',
    });
  }
});

// SEND LOGIN WITH CODE
// export const sendLoginCode = asyncHandler(async (req, res) => {
//   const { email } = req.params;
//   const user = await User.findOne({ email });

//   if (!user) {
//     res.status(404);
//     throw new Error('User not found');
//   }

//   // const encryptedLoginCode = cryptr.encrypt(user._id);

//   // const decryptedLoginCode = cryptr.decrypt(encryptedLoginCode);

//   // Send Email
//   const subject = 'Login Access Code - SOCIAL-MEDIA-IT';
//   const send_to = email;
//   const sent_from = process.env.EMAIL_USER;
//   const reply_to = 'noreply@nhat.com';
//   const template = 'loginCode';
//   const name = `${user.lastName} ${user.firstName}`;
//   const link = user._id;

//   try {
//     await sendEmail(
//       subject,
//       send_to,
//       sent_from,
//       reply_to,
//       template,
//       name,
//       link
//     );
//     res.status(200).json({ message: 'Password Reset Email Sent' });
//   } catch (error) {
//     res.status(500);
//     throw new Error('Email not sent, please try again');
//   }
// });

export const updateNotification = asyncHandler(async (req, res) => {
  const notification = req.body;

  const notificationFound = await Notification.findById(notification._id);

  if (!notificationFound) {
    return res.status(400).json({
      success: false,
      message: 'Notification not found',
    });
  }

  notificationFound.read = true;
  await notificationFound.save();

  return res.status(200).json({
    success: true,
    message: 'Notification update successful',
  });
});

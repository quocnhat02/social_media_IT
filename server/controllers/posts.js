import Post from '../models/Post.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import Comment from '../models/Comment.js';

// CREATE
export const createPost = async (req, res) => {
  try {
    const { userId, title, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      title,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();

    const post = await Post.find();

    res.status(201).json(post);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

// READ
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find().populate({
      path: "comments",
      populate: {
          path: "user likes",
          select: "-password"
      }
  });

    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });

    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getDetailPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId).populate({
      path: "comments",
      populate: {
          path: "user likes",
          select: "-password"
      }
  });
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// UPDATE
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, notificationPayload } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPostNew = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    // if (userId !== notificationPayload?.user) {
    //   const newNotification = new Notification(req.body.notificationPayload);
    //   await newNotification.save();
    // }

    // const found = await Notification.findOne({
    //   user: notificationPayload.user,
    //   title: notificationPayload.title,
    //   onClick: notificationPayload.onClick,
    //   read: false,
    // });

    // if (!found) {
    //   console.log(found);
    // }

    if (userId !== notificationPayload?.user) {
      const newNotification = new Notification(notificationPayload);
      await newNotification.save();
    }
    return res.status(200).json(updatedPostNew);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

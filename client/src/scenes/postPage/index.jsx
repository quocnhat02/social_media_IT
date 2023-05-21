/* eslint-disable react-hooks/exhaustive-deps */
import { useTheme } from '@emotion/react';
import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from '@mui/icons-material';
import {
  Box,
  Divider,
  IconButton,
  InputBase,
  Typography,
  useMediaQuery,
} from '@mui/material';
import FlexBetween from 'components/FlexBetween';
import Friend from 'components/Friend';
import WidgetWrapper from 'components/WidgetWrapper';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from 'scenes/navbar';
import FriendListWidget from 'scenes/widgets/FriendListWidget';
import UserWidget from 'scenes/widgets/UserWidget';
import { io } from 'socket.io-client';
import { setNotifications, setPost, setUnreadCount } from 'state';

const socket = io('http://localhost:3001');

const PostDetail = () => {
  const { postId } = useParams();
  const [blog, setBlog] = useState();
  const [isComments, setIsComments] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const loggedInUserId = useSelector((state) => state.user._id);
  const [fetchAgain, setFetchAgain] = useState(false);

  const isLiked = blog?.likes[loggedInUserId]
    ? Boolean(blog?.likes[loggedInUserId])
    : false;
  const likeCount = blog?.likes ? Object.keys(blog?.likes).length : 0;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const isNonMobileScreens = useMediaQuery('(min-width:1000px)');
  const { _id, picturePath } = useSelector((state) => state.user);
  const unreadCount = useSelector((state) => state.unreadCount);

  const getAllNotifications = async () => {
    const response = await fetch(
      `http://localhost:3001/users/notifications/${loggedInUserId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const notificationsResponse = await response.json();

    if (notificationsResponse.success) {
      const notificationsTemp = {
        read: notificationsResponse.notifications.filter(
          (notification) => notification.read
        ),

        unread: notificationsResponse.notifications.filter(
          (notification) => !notification.read
        ),
      };

      dispatch(setNotifications(notificationsTemp));

      dispatch(setUnreadCount(notificationsTemp.unread.length));
    }
  };

  const patchLike = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: loggedInUserId,
        notificationPayload: {
          user: blog.userId,
          title: `${user.firstName} ${user.lastName} ${
            isLiked ? 'unliked' : 'liked'
          } your blog has title: ${blog.title}`,
          onClick: `/posts/${postId}`,
        },
      }),
    });

    if (user._id !== blog.userId) {
      socket.emit('newNotification', {
        userId: blog.userId,
        title: `${user.firstName} ${user.lastName} ${
          isLiked ? 'unliked' : 'liked'
        } your blog has title: ${blog.title}`,
        onClick: `/posts/${postId}`,
      });
    }
    socket.emit('create post');

    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
    getAllNotifications();
    setBlog(updatedPost);
    // const updatedNotification = await getAllNotifications();
    // dispatch(setNotifications({ ...notifications, updatedNotification }));
  };

  const getPostDetail = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    // isLiked = Boolean(data.likes[loggedInUserId]);
    // likeCount = Object.keys(data.likes).length;
    setBlog(data);
  };

  useEffect(() => {
    if (user) {
      socket.emit('join', user._id);
    }

    socket.off('newNotification').on('newNotification', (data) => {
      toast.info(`🦄 ${data.title}`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      dispatch(setUnreadCount(unreadCount + 1));
      setFetchAgain(!fetchAgain);
    });
  }, [user]);

  useEffect(() => {
    getPostDetail();
  }, []);

  return (
    <Box>
      <Navbar />
      <Box
        width='100%'
        padding='2rem 6%'
        display={isNonMobileScreens ? 'flex' : 'block'}
        gap='2rem'
        justifyContent='center'
      >
        <Box flexBasis={isNonMobileScreens ? '26%' : undefined}>
          <UserWidget userId={_id} picturePath={user.picturePath} />
          <Box m='2rem 0' />
          <FriendListWidget userId={_id} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? '52%' : undefined}
          mt={isNonMobileScreens ? undefined : '2rem'}
        >
          <WidgetWrapper>
            <Friend
              friendId={blog?.userId}
              name={`${blog?.firstName} ${blog?.lastName}`}
              subtitle={blog?.location}
              userPicturePath={blog?.picturePath}
            />
            <Typography color={main} sx={{ mt: '1rem' }}>
              {blog?.title}
            </Typography>
            <br />
            <Typography color={main} style={{ mt: '1rem' }}>
              {blog?.description}
            </Typography>
            {blog?.picturePath && (
              <img
                width='100%'
                height='auto'
                alt='post'
                style={{ borderRadius: '0.75rem', marginTop: '0.75rem' }}
                src={`http://localhost:3001/assets/${blog?.picturePath}`}
              />
            )}
            <FlexBetween mt='0.25rem'>
              <FlexBetween gap='1rem'>
                <FlexBetween gap='0.3rem'>
                  <IconButton onClick={patchLike}>
                    {isLiked ? (
                      <FavoriteOutlined sx={{ color: primary }} />
                    ) : (
                      <FavoriteBorderOutlined />
                    )}
                  </IconButton>
                  <Typography>{likeCount}</Typography>
                </FlexBetween>

                <FlexBetween gap='0.3rem'>
                  <IconButton onClick={() => setIsComments(!isComments)}>
                    <ChatBubbleOutlineOutlined />
                  </IconButton>
                  <Typography>{blog?.comments?.length}</Typography>
                </FlexBetween>
              </FlexBetween>

              <IconButton>
                <ShareOutlined />
              </IconButton>
            </FlexBetween>
            <InputBase
              placeholder='Enter a comment'
              sx={{
                fontSize: '1.1rem',
                marginTop: '0.5rem',
              }}
            />
            {isComments && (
              <Box mt='0.7rem'>
                {blog?.comments.map((comment, i) => (
                  <Box key={`${`${blog?.firstName}${blog?.lastName}`}-${i}`}>
                    <Divider />
                    <Typography sx={{ color: main, m: '0.5rem 0', pl: '1rem' }}>
                      {comment}
                    </Typography>
                  </Box>
                ))}
                <Divider />
              </Box>
            )}
          </WidgetWrapper>
        </Box>
      </Box>
    </Box>
  );
};

export default PostDetail;

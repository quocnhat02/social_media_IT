/* eslint-disable react-hooks/exhaustive-deps */
import { Box, useMediaQuery } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from 'scenes/navbar';
import UserWidget from 'scenes/widgets/UserWidget';
import MyPostWidget from 'scenes/widgets/MyPostWidget';
import PostsWidget from 'scenes/widgets/PostsWidget';
import FriendListWidget from 'scenes/widgets/FriendListWidget';
import { setNotifications, setSocket, setUnreadCount } from 'state';

import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
const socket = io('http://localhost:3001');

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery('(min-width:1000px)');
  const { _id, picturePath } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const notification = useSelector((state) => state.notification);
  const unreadCount = useSelector((state) => state.unreadCount);
  const dispatch = useDispatch();

  const getAllNotifications = async () => {
    const response = await fetch(
      `http://localhost:3001/users/notifications/${_id}`,
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

  useEffect(() => {
    getAllNotifications();
  }, []);

  useEffect(() => {
    if (user) {
      socket.emit('join', user._id);
    }

    socket.off('newNotification').on('newNotification', (data) => {
      // toast.dismiss();
      // toast.success(data.title);
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
    });
  }, [user]);

  return (
    <Box>
      <Navbar />
      <Box
        width='100%'
        padding='2rem 6%'
        display={isNonMobileScreens ? 'flex' : 'block'}
        gap='0.5rem'
        justifyContent='space-between'
      >
        <Box flexBasis={isNonMobileScreens ? '26%' : undefined}>
          <UserWidget userId={_id} picturePath={picturePath} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? '42%' : undefined}
          mt={isNonMobileScreens ? undefined : '2rem'}
        >
          <MyPostWidget picturePath={picturePath} />
          <PostsWidget userId={_id} />
        </Box>
        {isNonMobileScreens && (
          <Box flexBasis='26%'>
            <FriendListWidget userId={_id} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;

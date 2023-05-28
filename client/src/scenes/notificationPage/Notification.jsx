import { Box, Divider, Typography } from '@mui/material';
import moment from 'moment';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUnreadCount } from 'state';

const Notification = ({ notifications }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const unreadCount = useSelector((state) => state.unreadCount);

  const handleNotification = async (notification) => {
    const response = await fetch(
      'http://127.0.0.1:3001/users/updateNotification',
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notification),
      }
    );

    const notificationsResponse = await response.json();

    if (unreadCount > 0) {
      dispatch(setUnreadCount(unreadCount - 1));
    }

    navigate(notification.onClick);
  };

  return (
    <Box mt={4}>
      {!notifications ? (
        <Typography variant='h3'>Not a notification</Typography>
      ) : (
        notifications.map((notification) => (
          <Box
            key={notification._id}
            sx={{
              margin: '1.5rem 0',
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8,
              },
            }}
            onClick={
              notification.read
                ? () => {}
                : () => handleNotification(notification)
            }
          >
            <Typography variant='h3'>{notification.title}</Typography>
            <Typography variant='h5' sx={{ color: 'orange' }}>
              {moment(notification.createdAt).fromNow()}
            </Typography>
            <Divider sx={{ marginTop: '0.25rem' }} />
          </Box>
        ))
      )}
    </Box>
  );
};

export default Notification;

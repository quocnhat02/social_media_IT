import { Box, Divider, Typography } from '@mui/material';
import moment from 'moment';
import React from 'react';

const Notification = ({ notifications }) => {
  return (
    <Box mt={4}>
      {!notifications ? (
        <Typography variant='h3'>Not a notification</Typography>
      ) : (
        notifications.map((notification) => (
          <Box key={notification._id} sx={{ margin: '1.5rem 0' }}>
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

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { Box, Divider, Typography } from '@mui/material';
import Navbar from 'scenes/navbar';
import { useSelector } from 'react-redux';
import TabsNotification from 'components/TabsNotification';
import moment from 'moment/moment';
import Notification from './Notification';

const NotificationPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const user = useSelector((state) => state.user);
  const notifications = useSelector((state) => state.notifications);

  const tabs = [
    {
      name: 'UnRead',
      component: <Notification notifications={notifications.unread} />,
    },
    {
      name: 'Read',
      component: <Notification notifications={notifications.read} />,
    },

    // {
    //   name: 'All',
    //   component: <Box>All</Box>,
    // },
  ];

  return (
    <Box>
      <Navbar />
      <Box sx={{ width: '85%', margin: 'auto' }}>
        <Typography
          variant='h1'
          sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            cursor: 'pointer',
            textTransform: 'uppercase',
            fontSize: '24px',
          }}
        >
          Notifications
        </Typography>
        <TabsNotification
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        ></TabsNotification>
      </Box>
    </Box>
  );
};

export default NotificationPage;

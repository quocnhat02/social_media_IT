import { Box } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import SingleChat from './SingleChat';

const ChatBox = () => {
  const selectedChat = useSelector((state) => state.selectedChat);

  return (
    <Box
      display={{
        xs: selectedChat ? 'flex' : 'none',
        sm: selectedChat ? 'flex' : 'none',
        md: 'flex',
      }}
      alignItems={'center'}
      flexDirection={'column'}
      p={3}
      bgcolor={'white'}
      width={{ sm: '100%', md: '68%' }}
      borderRadius={'lg'}
      border={'1px'}
    >
      <SingleChat />
    </Box>
  );
};

export default ChatBox;

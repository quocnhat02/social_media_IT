import { Box } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import SingleChat from './SingleChat';

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
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
      bgcolor={'#38b2ac'}
      width={{ sm: '100%', xs: '100%', md: '68%' }}
      borderRadius={'12px'}
      border={'1px'}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;

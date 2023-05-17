/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ChatLoading from './ChatLoading';
import { getSender } from 'utils/ChatLogic';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setChats, setSelectedChat } from 'state';
import { Box, Button, Stack } from '@mui/material';
import GroupChatModal from '../miscellaneous/GroupChatModal';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

const MyChat = () => {
  const [loggedUser, setLoggedUser] = useState();

  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const selectedChat = useSelector((state) => state.selectedChat);
  const chats = useSelector((state) => state.chats);
  const fetchAgain = useSelector((state) => state.fetchAgain);

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(
        'http://localhost:3001/api/chat',
        config
      );

      dispatch(setChats(data));
    } catch (error) {
      toast({
        title: 'Error occurred',
        description: 'Failed to load the chats',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  useEffect(() => {
    setLoggedUser(user);
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{
        xs: selectedChat ? 'none' : 'flex',
        sm: selectedChat ? 'none' : 'flex',
        md: 'flex',
      }}
      flexDirection={'column'}
      alignItems={'center'}
      padding={3}
      bgcolor={'#333'}
      width={{ sm: '100%', md: '31%' }}
      borderRadius={'lg'}
      border={'1px'}
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ sm: '18px', md: '24px' }}
        display={'flex'}
        width={'100%'}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        My Chats
        <GroupChatModal>
          <Button
            display={'flex'}
            fontSize={{ sm: '15px', md: '10px', lg: '17px' }}
            // rightIcon={<AddOutlinedIcon />}
          >
            New Group Chat
            <AddOutlinedIcon />
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display={'flex'}
        flexDirection={'column'}
        p={3}
        bg={'#F8F8F8'}
        w={'100%'}
        h={'100%'}
        borderRadius={'lg'}
        sx={{
          overflowY: 'hidden',
        }}
      >
        {chats ? (
          <Stack
            sx={{
              overflowY: 'scroll',
            }}
          >
            {chats.map((chat) => (
              <Box
                onClick={() => dispatch(setSelectedChat(chat))}
                cursor={'pointer'}
                bgcolor={selectedChat === chat ? '#38B2AC' : '#E8E8E8'}
                color={selectedChat === chat ? 'white' : 'black'}
                px={3}
                py={2}
                borderRadius={'lg'}
                key={chat._id}
              >
                <h3>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </h3>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChat;

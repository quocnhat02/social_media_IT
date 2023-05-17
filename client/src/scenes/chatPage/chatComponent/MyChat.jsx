/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ChatLoading from './ChatLoading';
import { getSender } from 'utils/ChatLogic';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setChats, setSelectedChat } from 'state';
import { Box, Button, Stack, Typography } from '@mui/material';
import GroupChatModal from '../miscellaneous/GroupChatModal';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';

const MyChat = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();

  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const selectedChat = useSelector((state) => state.selectedChat);
  const chats = useSelector((state) => state.chats);
  const mode = useSelector((state) => state.mode);

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
    // setLoggedUser(user);
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
      bgcolor={`${mode === 'light' ? '#d8d8d8' : '#333'}`}
      width={{ sm: '100%', xs: '100%', md: '31%' }}
      borderRadius={'12px'}
      border={'1px'}
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ sm: '18px', xs: '16px', md: '24px' }}
        display={'flex'}
        width={'100%'}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        MY CHAT
        <GroupChatModal>
          <Button display={'flex'}>
            New Group Chat
            <AddOutlinedIcon />
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display={'flex'}
        flexDirection={'column'}
        p={3}
        bgcolor={'#051926'}
        width={'100%'}
        height={'100%'}
        borderRadius={'12px'}
        sx={{
          overflowY: 'hidden',
        }}
      >
        {chats ? (
          <Stack
            sx={{
              overflowY: 'scroll',
              gap: '10px',
            }}
          >
            {chats.map((chat) => (
              <Box
                onClick={() => dispatch(setSelectedChat(chat))}
                sx={{
                  cursor: 'pointer',
                  background: selectedChat === chat ? '#38B2AC' : '#E8E8E8',
                  color: selectedChat === chat ? 'white' : 'black',
                  borderRadius: '10px',
                  paddingX: 3,
                  paddingY: 2,
                  fontSize: {
                    sm: '12px',
                    xs: '12px',
                    md: '18px',
                  },
                }}
                key={chat._id}
              >
                <Typography variant='h4'>
                  {!chat.isGroupChat ? (
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {getSender(user, chat.users)}
                    </span>
                  ) : (
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.7rem',
                      }}
                    >
                      {chat.chatName}
                      <GroupsOutlinedIcon
                        sx={{ fontSize: '1.8rem', color: 'green' }}
                      ></GroupsOutlinedIcon>{' '}
                    </span>
                  )}
                </Typography>
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

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { toast } from 'react-toastify';

import io from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  FormControl,
  IconButton,
  Input,
  TextField,
  Typography,
} from '@mui/material';
import UpdateGroupChatModal from '../miscellaneous/UpdateGroupChatModal';
import { getFullSender, getSender } from 'utils/ChatLogic';
import ProfileModal from '../miscellaneous/ProfileModal';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import ScrollableChat from './ScrollableChat';
import { setNotifications, setSelectedChat, setUnreadCount } from 'state';

const ENDPOINT = 'http://localhost:3001';

let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);

  const dispatch = useDispatch();

  const token = useSelector((state) => state.token);
  const selectedChat = useSelector((state) => state.selectedChat);
  const notification = useSelector((state) => state.notifications);
  const user = useSelector((state) => state.user);

  const fetchMessages = async () => {
    if (!selectedChat) {
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:3001/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit('join chat', selectedChat._id);
    } catch (error) {
      toast({
        title: 'Error occurred',
        description: 'Failed to load the messages',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    if (e.key === 'Enter' && newMessage) {
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
        setNewMessage('');
        const { data } = await axios.post(
          'http://localhost:3001/api/message',
          {
            content: newMessage,
            chatId: selectedChat._id,
            userId: user._id,
            // notificationPayload: {
            //   user: selectedChat,
            //   title: `${user.firstName} ${user.lastName} send your message`,
            //   onClick: `/posts`,
            // },
          },
          config
        );

        socket.emit('new message', data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: 'Error occurred',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      }
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('setup', user);
    socket.on('connected', () => {
      setSocketConnected(true);
    });
  }, []);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  // const getAllNotifications = async () => {
  //   const response = await fetch(
  //     `http://localhost:3001/users/notifications/${user._id}`,
  //     {
  //       method: 'GET',
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         'Content-Type': 'application/json',
  //       },
  //     }
  //   );

  //   const notificationsResponse = await response.json();

  //   if (notificationsResponse.success) {
  //     const notificationsTemp = {
  //       read: notificationsResponse.notifications.filter(
  //         (notification) => notification.read
  //       ),

  //       unread: notificationsResponse.notifications.filter(
  //         (notification) => !notification.read
  //       ),
  //     };

  //     dispatch(setNotifications(notificationsTemp));

  //     dispatch(setUnreadCount(notificationsTemp.unread.length));
  //   }
  // };

  useEffect(() => {
    socket.on('message received', (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        // notification
        if (!notification.unread.includes(newMessageReceived)) {
          // dispatch(setNotifications([newMessageReceived, ...notification]));
          // setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  return (
    <>
      {selectedChat ? (
        <>
          <Typography
            fontSize={{ sm: '24px', md: '30px' }}
            pb={3}
            px={2}
            width={'100%'}
            display={'flex'}
            justifyContent={{ sm: 'space-between' }}
            alignItems={'center'}
          >
            <IconButton
              display={{ sm: 'flex', xs: 'flex', md: 'none' }}
              sx={{
                marginRight: '1.2rem',
              }}
              onClick={() => dispatch(setSelectedChat(''))}
            >
              <ArrowBackOutlinedIcon />
            </IconButton>
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal
                    user={getFullSender(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                    fetchMessages={fetchMessages}
                  />
                </>
              ))}
          </Typography>
          <Box
            display={'flex'}
            flexDirection={'column'}
            justifyContent={'flex-end'}
            p={3}
            bgcolor={'#051926'}
            width={'100%'}
            height={'100%'}
            borderRadius={'10px'}
            sx={{
              overflowY: 'hidden',
            }}
          >
            {loading ? (
              <CircularProgress
                sx={{
                  width: 20,
                  height: 20,
                  alignSelf: 'center',
                  margin: 'auto',
                }}
                color='secondary'
                size={'xl'}
              />
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflowY: 'scroll',
                  scrollbarWidth: 'none',
                }}
              >
                {/* Messages */}
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={handleSendMessage} mt={3}>
              {/* {isTyping ? <div>Loading...</div> : <></>} */}
              <Input
                variant={'filled'}
                sx={{
                  background: '#38b2ac',
                  fontSize: '1.2rem',
                  padding: '2px 10px',
                  marginTop: '10px',
                  borderRadius: '5px',
                }}
                placeholder='Enter a message...'
                onChange={handleTyping}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
          height={'100%'}
        >
          <Typography fontSize={'30px'} pb={3}>
            Click on a user to start chatting
          </Typography>
        </Box>
      )}
    </>
  );
};

export default SingleChat;

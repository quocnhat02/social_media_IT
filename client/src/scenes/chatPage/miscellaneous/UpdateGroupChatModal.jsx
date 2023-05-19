import React, { useState } from 'react';
import UserBadgeItem from '../userAvatar/UserBadgeItem';
import axios from 'axios';
import UserListItem from '../userAvatar/UserListItem';
import { throttle } from 'lodash';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedChat } from 'state';
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  Typography,
} from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CircularProgress from '@mui/material/CircularProgress';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  backgroundColor: '#865DFF',
  border: '2px solid #000',
  boxShadow: 24,
  padding: 4,
};

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const dispatch = useDispatch();

  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const selectedChat = useSelector((state) => state.selectedChat);

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: 'User already in group',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: 'Only admin can add someone!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.put(
        'http://localhost:3001/api/chat/group-add',
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      dispatch(setSelectedChat(data));
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: 'Error occurred',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      setLoading(false);
    }
    setGroupChatName('');
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        title: 'Only admin can add someone!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        'http://localhost:3001/api/chat/group-remove',
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );
      user1._id === user._id
        ? dispatch(setSelectedChat())
        : dispatch(setSelectedChat(data));
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast({
        title: 'Error occurred',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      setLoading(false);
    }
    setGroupChatName('');
  };

  const handleRename = async () => {
    if (!groupChatName) {
      return;
    }
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        'http://localhost:3001/api/chat/group-rename',
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      dispatch(setSelectedChat(data));
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: 'Error occurred',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      setRenameLoading(false);
    }
    setGroupChatName('');
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const throttledSearch = throttle(async () => {
        const { data } = await axios.get(
          `http://localhost:3001/users?search=${search}`,
          config
        );
        setLoading(false);
        setSearchResult(data);
      }, 1000);

      throttledSearch();
    } catch (error) {
      toast({
        title: 'Error occurred',
        description: 'Failed to load the search results',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton
        display={{ sm: 'flex' }}
        sx={{
          marginLeft: 'auto',
        }}
        onClick={handleOpen}
        // icon={<VisibilityOutlinedIcon />}
      >
        <VisibilityOutlinedIcon />
      </IconButton>

      <Modal onClose={handleClose} open={open}>
        <Box sx={style}>
          <Typography
            display={'flex'}
            fontSize={'35px'}
            justifyContent={'center'}
            sx={{
              marginBottom: 2,
            }}
          >
            {selectedChat.chatName}
          </Typography>
          <Box>
            <Box
              width={'100%'}
              display={'flex'}
              sx={{
                flexWrap: 'wrap',
                paddingBottom: 3,
              }}
            >
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <FormControl sx={{ width: '70%' }}>
                <Input
                  placeholder='Chat Name'
                  sx={{
                    marginBottom: 1,
                    fontSize: {
                      md: '18px',
                      sm: '14px',
                    },
                  }}
                  value={groupChatName}
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
              </FormControl>
              <FormControl sx={{ width: '70%' }}>
                <Input
                  sx={{
                    marginBottom: 1,
                    fontSize: {
                      md: '18px',
                      sm: '14px',
                    },
                  }}
                  placeholder='Add User to group'
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </FormControl>
              <Button
                variant={'solid'}
                sx={{
                  background: '#362FD9',
                  marginTop: 1,
                  marginBottom: 1,
                  flexDirection: 'row-reverse',
                  color: 'white',
                }}
                color={'white'}
                onClick={handleRename}
              >
                Update
              </Button>
            </Box>

            {loading ? (
              <CircularProgress color='secondary' />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row-reverse',
              width: '100%',
            }}
          >
            <Button
              sx={{
                background: '#F2921D',
                color: 'white',
              }}
              onClick={() => handleRemove(user)}
            >
              Leave Group
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;

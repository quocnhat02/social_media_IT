import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import UserBadgeItem from '../userAvatar/UserBadgeItem';
import UserListItem from '../userAvatar/UserListItem';
import { useDispatch, useSelector } from 'react-redux';
import { setChats } from 'state';
import { Box, Button, FormControl, Icon, Input, Modal } from '@mui/material';

const GroupChatModal = ({ children }) => {
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const dispatch = useDispatch();

  const token = useSelector((state) => state.token);
  const chats = useSelector((state) => state.chats);

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

      const { data } = await axios.get(
        `http://localhost:3001/users?search=${search}`,
        config
      );

      setLoading(false);
      setSearchResult(data);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!groupChatName || !selectedUsers) {
      toast({
        title: 'Please fill all the fields',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post(
        'http://localhost:3001/api/chat/group',
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );

      dispatch(setChats([data, ...chats]));
      setOpen(false);
      toast({
        title: 'New Group Chat created',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    } catch (error) {
      toast({
        title: 'Failed to Create the Group Chat',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      setOpen(false);
    }
  };

  const handleDelete = (deleteUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== deleteUser._id));
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: 'User already added',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  return (
    <>
      <span
        onClick={handleOpen}
        sx={{
          fontSize: '1.1rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {children}
      </span>
      <Modal
        open={open}
        onClose={handleClose}
        sx={{
          width: {
            sm: '70vw',
            md: '40vw',
          },
          height: '70vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          margin: 'auto',
          background: '#009EFF',
          opacity: 0.95,
          borderRadius: '15px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}
        >
          <>
            <FormControl>
              <Input
                sx={{
                  fontSize: '20px',
                  marginBottom: '10px',
                }}
                placeholder='Chat Name'
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                sx={{
                  fontSize: '20px',
                  marginBottom: '15px',
                }}
                placeholder='Add Users eg: John, Tom'
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
          </>
          {/* selected users */}
          <>
            <Box sx={{ width: '100%', display: 'flex', flexWrap: 'wrap' }}>
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>
            <Box>
              {/* render searched user */}
              {loading ? (
                <div>loading</div>
              ) : (
                searchResult
                  ?.slice(0, 4)
                  .map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => handleGroup(user)}
                    />
                  ))
              )}
            </Box>
            <Button
              color='primary'
              variant='contained'
              sx={{
                marginY: '5px',
              }}
              onClick={handleSubmit}
            >
              Create Chat
            </Button>
          </>
        </Box>
      </Modal>
    </>
  );
};

export default GroupChatModal;

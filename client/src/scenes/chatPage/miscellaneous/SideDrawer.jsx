import React, { useState } from 'react';
import axios from 'axios';
import UserListItem from '../userAvatar/UserListItem';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setChats, setSelectedChat } from 'state';
import {
  Box,
  Button,
  Typography,
  Drawer,
  IconButton,
  TextField,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import ChatLoading from '../chatComponent/ChatLoading';
import CircularProgress from '@mui/material/CircularProgress';

const SideDrawer = () => {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const dispatch = useDispatch();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const chats = useSelector((state) => state.chats);
  const token = useSelector((state) => state.token);
  const notification = useSelector((state) => state.notifications);

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: 'Please enter something in search',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-left',
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

  const handleAccessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post(
        'http://localhost:3001/api/chat',
        { userId },
        config
      );

      if (!chats.find((c) => c._id === data._id)) {
        dispatch(setChats([data, ...chats]));
      }

      dispatch(setSelectedChat(data));
      setLoadingChat(false);
      setIsDrawerOpen(false);
    } catch (error) {
      toast({
        title: 'Error fetching the chat',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      setLoadingChat(false);
    }
  };

  return (
    <>
      <IconButton
        size='large'
        edge='start'
        color='inherit'
        aria-label='logo'
        onClick={() => setIsDrawerOpen(true)}
        sx={{
          marginLeft: '10px',
        }}
      >
        <Search />
        <Typography variant='h5'>Search User</Typography>
      </IconButton>
      <Drawer
        anchor='left'
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        PaperProps={{
          sx: { width: '400px' },
        }}
      >
        <Box p={2} width={'100%'} textAlign={'center'} role={'presentation'}>
          <Typography variant='h6' component={'div'}>
            Search User
          </Typography>
          <Box display={'flex'} pb={2} pt={2} gap={'5px'}>
            <TextField
              placeholder='Search by name or email'
              mr={'2'}
              p={2}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                flex: 3,
              }}
            />
            <Button
              sx={{
                flex: 1,
              }}
              onClick={handleSearch}
            >
              Search
            </Button>
          </Box>
          {loading ? (
            <ChatLoading />
          ) : (
            searchResult.map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                handleFunction={() => handleAccessChat(user._id)}
              />
            ))
          )}
          {loadingChat && <CircularProgress color='secondary' />}
        </Box>
      </Drawer>
    </>
  );
};

export default SideDrawer;

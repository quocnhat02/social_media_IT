import { useState } from 'react';
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
  Modal,
  TextField,
} from '@mui/material';

import {
  Search,
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Menu,
  Close,
  Info,
} from '@mui/icons-material';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
// import InfoIcon from '@mui/icons-material/Info';
import { useDispatch, useSelector } from 'react-redux';
import { setMode, setLogout, setNotifications } from 'state';
import { useNavigate } from 'react-router-dom';
import FlexBetween from 'components/FlexBetween';
import { toast } from 'react-toastify';
import { Button } from 'react-chat-engine-advanced';
import axios from 'axios';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  height: 400,
  backgroundColor: '#537188',
  border: '2px solid #000',
  boxShadow: 24,
  paddingTop: 5,
  paddingX: 4,
  paddingBottom: 3,
};

const initialState = {
  oldPassword: '',
  password: '',
  password2: '',
};

const Navbar = () => {
  const { palette } = useTheme();
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const notifications = useSelector((state) => state.notifications);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const unreadCount = useSelector((state) => state.unreadCount);
  const isNonMobileScreens = useMediaQuery('(min-width: 1000px)');

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.neutral.default;
  const primaryLight = theme.palette.neutral.mediumMain;
  const alt = theme.palette.neutral.alt;

  const fullName = `${user.firstName} ${user.lastName}`;

  const [formData, setFormData] = useState(initialState);
  const { oldPassword, password, password2 } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setFormData({ oldPassword: '', password: '', password2: '' });
  };

  const getAllNotifications = async () => {
    const response = await fetch(
      `http://localhost:3001/users/notifications/${user._id}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const notificationsResponse = await response.json();

    if (notificationsResponse.success) {
      const notificationsTemp = {
        read: notificationsResponse.notifications.filter(
          (notification) => notification.read
        ),

        unread: notificationsResponse.notifications.filter(
          (notification) => !notification.read
        ),
      };

      dispatch(setNotifications(notificationsTemp));
    }
  };

  const handleNotification = () => {
    getAllNotifications();
    navigate('/notifications');
  };

  const updatePassword = async (e) => {
    e.preventDefault();

    if (!oldPassword || !password || !password2) {
      return toast.error('All fields are required');
    }

    if (password !== password2) {
      return toast.error('Passwords do not match');
    }

    const userData = {
      oldPassword,
      password,
    };

    const response = await fetch('http://127.0.0.1:3001/users/changePassword', {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const { success, message } = await response.json();
    if (success) {
      handleClose();
      return toast.success(`🦄 ${message}`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    } else {
      return toast.error(`🦄 ${message}`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }
  };
  return (
    <FlexBetween padding='1rem 6%' backgroundColor={alt}>
      <FlexBetween gap='1.75rem'>
        <Typography
          fontWeight='bold'
          fontSize='clamp(1rem, 2rem, 2.25rem)'
          // color='primary'
          onClick={() => navigate('/home')}
          sx={{
            '&:hover': {
              color: primaryLight,
              cursor: 'pointer',
            },
            background:
              'linear-gradient(90deg, rgba(228,189,87,1) 6%, rgba(64,233,108,1) 28%, rgba(64,225,204,1) 50%, rgba(238,106,211,1) 71%,  rgba(241,67,67,1) 91%);',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          SocialMediaIT
        </Typography>
        {isNonMobileScreens && (
          <FlexBetween
            backgroundColor={neutralLight}
            borderRadius='9px'
            gap='3rem'
            padding='0.1rem 1.5rem'
          >
            <InputBase placeholder='Search...' />
            <IconButton>
              <Search />
            </IconButton>
          </FlexBetween>
        )}
      </FlexBetween>

      {/* DESKTOP NAV */}
      {isNonMobileScreens ? (
        <FlexBetween gap='2rem'>
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === 'dark' ? (
              <DarkMode sx={{ fontSize: '25px' }} />
            ) : (
              <LightMode sx={{ color: dark, fontSize: '25px' }} />
            )}
          </IconButton>
          <IconButton onClick={() => navigate('/admin/exams')}>
            <QuizOutlinedIcon sx={{ fontSize: '25px' }} />
          </IconButton>
          <IconButton onClick={() => navigate('/exams')}>
            <SchoolOutlinedIcon sx={{ fontSize: '25px' }} />
          </IconButton>
          <IconButton onClick={() => navigate('/chat')}>
            <Message sx={{ fontSize: '25px' }} />
          </IconButton>
          <IconButton
            sx={{ position: 'relative' }}
            onClick={() => handleNotification()}
          >
            <Notifications sx={{ fontSize: '25px' }} />
            <Typography
              variant='h6'
              sx={{
                position: 'absolute',
                display: 'block',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                backgroundColor: 'red',
                color: 'white',
                fontWeight: 400,
                borderRadius: '50%',
                p: '4px 6px',
                top: 0,
                right: 0,
                lineHeight: '10px',
              }}
            >
              {unreadCount | '0'}
            </Typography>
          </IconButton>
          {/* <Info sx={{ fontSize: '25px' }} /> */}
          {/* <Help sx={{ fontSize: '25px' }} /> */}
          <FormControl variant='standard' value={fullName}>
            <Select
              value={fullName}
              sx={{
                backgroundColor: neutralLight,
                width: '150px',
                borderRadius: '0.25rem',
                p: '0.25rem 1rem',
                '& .MuiSvgIcon-root': {
                  pr: '0.25rem',
                  width: '3rem',
                },
                '& .MuiSvgIcon-select:focus': {
                  backgroundColor: neutralLight,
                },
              }}
              input={<InputBase />}
            >
              <MenuItem value={fullName}>
                <Typography>{fullName}</Typography>
              </MenuItem>
              <MenuItem onClick={handleOpen}>
                <Typography>Change Password</Typography>
              </MenuItem>
              <MenuItem onClick={() => dispatch(setLogout())}>Logout</MenuItem>
            </Select>
          </FormControl>
        </FlexBetween>
      ) : (
        <IconButton
          onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
        >
          <Menu />
        </IconButton>
      )}

      {/* MOBILE NAV */}
      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          position='fixed'
          right='0'
          bottom='0'
          height='100%'
          zIndex='10'
          maxWidth='500px'
          minWidth='300px'
          backgroundColor={background}
        >
          {/* CLOSE ICON */}
          <Box display='flex' justifyContent='flex-end' p='1rem'>
            <IconButton
              onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
            >
              <Close />
            </IconButton>
          </Box>

          {/* MENU ITEMS */}
          <FlexBetween
            display='flex'
            flexDirection='column'
            justifyContent='center'
            alignItems='center'
            gap='3rem'
          >
            <IconButton
              onClick={() => dispatch(setMode())}
              sx={{ fontSize: '25px' }}
            >
              {theme.palette.mode === 'dark' ? (
                <DarkMode sx={{ fontSize: '25px' }} />
              ) : (
                <LightMode sx={{ color: dark, fontSize: '25px' }} />
              )}
            </IconButton>
            <IconButton onClick={() => navigate('/admin/exams')}>
              <QuizOutlinedIcon sx={{ fontSize: '25px' }} />
            </IconButton>
            <IconButton onClick={() => navigate('/exams')}>
              <SchoolOutlinedIcon sx={{ fontSize: '25px' }} />
            </IconButton>
            <IconButton onClick={() => navigate('/chat')}>
              <Message sx={{ fontSize: '25px' }} />
            </IconButton>
            <IconButton
              sx={{ position: 'relative' }}
              onClick={() => handleNotification()}
            >
              <Notifications sx={{ fontSize: '25px' }} />
              <Typography
                variant='h6'
                sx={{
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'red',
                  color: 'white',
                  fontWeight: 400,
                  borderRadius: '50%',
                  p: '2px 3px',
                  top: 0,
                  right: 0,
                  lineHeight: '14px',
                }}
              >
                {unreadCount | '0'}
              </Typography>
            </IconButton>
            {/* <Help sx={{ fontSize: '25px' }} /> */}
            <FormControl variant='standard' value={fullName}>
              <Select
                value={fullName}
                sx={{
                  backgroundColor: neutralLight,
                  width: '150px',
                  borderRadius: '0.25rem',
                  p: '0.25rem 1rem',
                  '& .MuiSvgIcon-root': {
                    pr: '0.25rem',
                    width: '3rem',
                  },
                  '& .MuiSvgIcon-select:focus': {
                    backgroundColor: neutralLight,
                  },
                }}
                input={<InputBase />}
              >
                <MenuItem value={fullName}>
                  <Typography>{fullName}</Typography>
                </MenuItem>
                <MenuItem onClick={handleOpen}>
                  <Typography>Change Password</Typography>
                </MenuItem>
                <MenuItem onClick={() => dispatch(setLogout())}>
                  Logout
                </MenuItem>
              </Select>
            </FormControl>
          </FlexBetween>
        </Box>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='child-modal-title'
        aria-describedby='child-modal-description'
      >
        <Box style={{ ...style, width: 400 }}>
          <form
            onSubmit={updatePassword}
            style={{
              padding: '1.2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '1rem',
            }}
          >
            <Typography
              variant='h2'
              id='child-modal-title'
              marginBottom={5}
              color='#FFD95A'
              textAlign={'center'}
            >
              Change Password
            </Typography>

            <TextField
              label='Current Password'
              type='password'
              onChange={handleInputChange}
              value={oldPassword}
              name='oldPassword'
              sx={{ gridColumn: 'span 4', width: '100%' }}
            />
            <TextField
              label='New Password'
              type='password'
              onChange={handleInputChange}
              value={password}
              name='password'
              sx={{ gridColumn: 'span 4', width: '100%' }}
            />
            <TextField
              label='Confirm New Password'
              type='password'
              onChange={handleInputChange}
              value={password2}
              name='password2'
              sx={{ gridColumn: 'span 4', width: '100%' }}
            />
            <Button
              fullWidth
              type='submit'
              style={{
                lineHeight: '4px',
                padding: '1rem',
                width: '100%',
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                '&:hover': {
                  color: palette.primary.main,
                },
              }}
            >
              Change Password
            </Button>
          </form>
        </Box>
      </Modal>
    </FlexBetween>
  );
};

export default Navbar;

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

// import InfoIcon from '@mui/icons-material/Info';
import { useDispatch, useSelector } from 'react-redux';
import { setMode, setLogout } from 'state';
import { useNavigate } from 'react-router-dom';
import FlexBetween from 'components/FlexBetween';

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const notifications = useSelector((state) => state.notifications);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery('(min-width: 1000px)');

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.neutral.default;
  const primaryLight = theme.palette.neutral.mediumMain;
  const alt = theme.palette.neutral.alt;

  const fullName = `${user.firstName} ${user.lastName}`;

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
          <IconButton onClick={() => navigate('/chat')}>
            <Message sx={{ fontSize: '25px' }} />
          </IconButton>
          <IconButton
            sx={{ position: 'relative' }}
            onClick={() => navigate('/notifications')}
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
              {notifications?.unread?.length | '0'}
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
            <IconButton onClick={() => navigate('/chat')}>
              <Message sx={{ fontSize: '25px' }} />
            </IconButton>
            <IconButton
              sx={{ position: 'relative' }}
              onClick={() => navigate('/notifications')}
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
                {notifications?.unread?.length | '0'}
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
                <MenuItem onClick={() => dispatch(setLogout())}>
                  Logout
                </MenuItem>
              </Select>
            </FormControl>
          </FlexBetween>
        </Box>
      )}
    </FlexBetween>
  );
};

export default Navbar;

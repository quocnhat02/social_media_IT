import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';

import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { RemoveRedEyeOutlined } from '@mui/icons-material';
import { useTheme } from '@emotion/react';
import { Button } from 'react-chat-engine-advanced';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

const initialState = {
  password: '',
  passwordConfirm: '',
};

const ResetPassword = () => {
  const { palette } = useTheme();
  const navigate = useNavigate();
  const { resetToken } = useParams();

  const [formData, setFormData] = useState(initialState);
  const { password, passwordConfirm } = formData;

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const togglePasswordConfirm = () => {
    setShowPasswordConfirm(!showPasswordConfirm);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!password || !passwordConfirm) {
      return toast.error('All fields are required');
    }

    if (password !== passwordConfirm) {
      return toast.error('Passwords do not match');
    }

    const userData = {
      password,
    };

    const response = await fetch(
      `http://127.0.0.1:3001/users/resetPassword/${resetToken}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      }
    );

    const { success, message } = await response.json();
    if (success) {
      navigate('/');

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
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        height: 400,
        bgcolor: '#27374D',
        border: '2px solid #000',
        boxShadow: 24,
        paddingTop: 5,
        paddingX: 2,
        paddingBottom: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography
        variant='h2'
        id='child-modal-title'
        marginBottom={5}
        color='#FFD95A'
        textAlign={'center'}
      >
        Reset Password
      </Typography>
      <form onSubmit={handleResetPassword}>
        <TextField
          onChange={handleInputChange}
          label='Password'
          type={showPassword ? 'text' : 'password'}
          value={password}
          name='password'
          sx={{ gridColumn: 'span 4', marginBottom: '1rem', width: '100%' }}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                {showPassword ? (
                  <IconButton onClick={() => togglePassword()}>
                    <VisibilityOffOutlinedIcon />
                  </IconButton>
                ) : (
                  <IconButton onClick={() => togglePassword()}>
                    <RemoveRedEyeOutlined />
                  </IconButton>
                )}
              </InputAdornment>
            ),
          }}
        />

        <TextField
          onChange={handleInputChange}
          label='Password Confirm'
          type={showPasswordConfirm ? 'text' : 'password'}
          value={passwordConfirm}
          name='passwordConfirm'
          sx={{ gridColumn: 'span 4', marginBottom: '1rem', width: '100%' }}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                {showPasswordConfirm ? (
                  <IconButton onClick={() => togglePasswordConfirm()}>
                    <VisibilityOffOutlinedIcon />
                  </IconButton>
                ) : (
                  <IconButton onClick={() => togglePasswordConfirm()}>
                    <RemoveRedEyeOutlined />
                  </IconButton>
                )}
              </InputAdornment>
            ),
          }}
        />
        <Button
          type='submit'
          fullWidth
          style={{
            margin: '10px 0',
            lineHeight: '4px',
            padding: '1.2rem',
            width: '100%',
            backgroundColor: palette.primary.main,
            color: palette.background.alt,
            '&:hover': {
              color: palette.primary.main,
            },
          }}
        >
          Send Email
        </Button>
      </form>
    </Box>
  );
};

export default ResetPassword;

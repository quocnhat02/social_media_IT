import { useTheme } from '@emotion/react';
import { Box, TextField, Typography } from '@mui/material';
import React from 'react';
import { Button } from 'react-chat-engine-advanced';

const LoginWithCode = () => {
  const { palette } = useTheme();

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
        Enter Access Code
      </Typography>
      <TextField
        label='code'
        name='text'
        sx={{ gridColumn: 'span 4', marginBottom: '1rem' }}
      />

      <Button
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
        Proceed To Login
      </Button>
    </Box>
  );
};

export default LoginWithCode;

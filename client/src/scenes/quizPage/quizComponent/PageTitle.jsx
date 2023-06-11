import { Box, Typography } from '@mui/material';
import React from 'react';

const PageTitle = ({ title }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Typography variant='h2'>{title}</Typography>
    </Box>
  );
};

export default PageTitle;

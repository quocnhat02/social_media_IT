import { Box } from '@mui/material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

import React from 'react';

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      sx={{
        paddingX: 2,
        paddingY: 1,
        borderRadius: '12px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '2px',
        fontSize: {
          sm: '10px',
          md: '14px',
        },
      }}
      m={1}
      mb={2}
      variant={'solid'}
      backgroundColor={'#E90064'}
      color={'white'}
      cursor={'pointer'}
      onClick={handleFunction}
    >
      <span>
        {user.firstName} {user.lastName}
      </span>
      <CloseOutlinedIcon
        sx={{
          cursor: 'pointer',
          fontSize: {
            sm: '10px',
            md: '18px',
          },
        }}
      />
    </Box>
  );
};

export default UserBadgeItem;

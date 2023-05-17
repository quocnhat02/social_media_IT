import { Avatar, Box } from '@mui/material';
import React from 'react';

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      sx={{
        cursor: 'pointer',
        background: '#E8E8E8',
        '&:hover': {
          background: '#38B2AC',
          color: 'white',
        },
        width: '100%',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        color: 'black',
        paddingX: '15px',
        paddingY: '5px',
        marginBottom: 2,
        borderRadius: '8px',
        fontSize: '14px',
      }}
    >
      <Avatar
        sx={{
          marginRight: '10px',
        }}
        size={'sm'}
        cursor={'pointer'}
        name={`${user.firstName}${user.lastName}`}
        // src={user.picturePath}
        src={`http://localhost:3001/assets/${user.picturePath}`}
      />
      <Box>
        <b>
          {user.firstName} {user.lastName}
        </b>
        <br />
        <span>Email: {user.email}</span>
      </Box>
    </Box>
  );
};
export default UserListItem;

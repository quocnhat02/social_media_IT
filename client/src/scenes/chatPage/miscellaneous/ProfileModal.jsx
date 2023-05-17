import { Box, IconButton, Modal, Typography } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import React, { useState } from 'react';
import { Avatar } from 'react-chat-engine-advanced';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const ProfileModal = ({ user, children }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {children ? (
        <span onClick={handleOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ sm: 'flex' }}
          icon={<VisibilityOutlinedIcon />}
          onClick={handleOpen}
        ></IconButton>
      )}
      <Modal size={'lg'} onClose={handleClose}>
        <Box sx={style}>
          <Typography
            fontSize={'40px'}
            display={'flex'}
            justifyContent={'center'}
          >
            {user.firstName} {user.lastName}
          </Typography>
          <Box
            display={'flex'}
            flexDirection={'column'}
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <Avatar
              borderRadius={'full'}
              boxSize={'150px'}
              src={user.picturePath}
              alt={`${user.firstName}${user.lastName}`}
            />
            <Typography>{user.email}</Typography>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default ProfileModal;

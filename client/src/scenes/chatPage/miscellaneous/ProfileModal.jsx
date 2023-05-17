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
  background: '#A459D1',
  border: '2px solid #000',
  boxShadow: 24,
  padding: 4,
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
          sx={{ marginLeft: 'auto' }}
          onClick={handleOpen}
        >
          <VisibilityOutlinedIcon />
        </IconButton>
      )}
      <Modal size={'lg'} open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography
            fontSize={'40px'}
            display={'flex'}
            justifyContent={'center'}
          >
            {user?.firstName} {user?.lastName}
          </Typography>
          <Box
            display={'flex'}
            flexDirection={'column'}
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            {/* <Avatar
              borderRadius={'full'}
              boxSize={'150px'}
              // src={user?.picturePath}
              src={`http://localhost:3001/assets/${user?.picturePath}`}
            /> */}

            <div>
              <img
                src={`http://localhost:3001/assets/${user?.picturePath}`}
                alt=''
                width={'100px'}
                height={'100px'}
                style={{
                  borderRadius: '50%',
                }}
              />
            </div>
            <Typography>{user?.email}</Typography>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default ProfileModal;

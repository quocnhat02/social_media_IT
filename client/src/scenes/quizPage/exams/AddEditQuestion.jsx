import { Box, Modal, Typography } from '@mui/material';
import React from 'react';
import { Button } from 'react-chat-engine-advanced';
import { useNavigate } from 'react-router-dom';

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

const AddEditQuestion = ({ open, setOpen, handleClose }) => {
  //   const [open, setOpen] = React.useState(false);
  //   const handleOpen = () => setOpen(true);
  //   const handleClose = () => setOpen(false);
  //   const navigate = useNavigate();
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={style}>
        <Typography id='modal-modal-title' variant='h6' component='h2'>
          Add Question
        </Typography>
        <Typography id='modal-modal-description' sx={{ mt: 2 }}>
          Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
        </Typography>
        <Button
          sx={{
            display: 'flex',
            width: '100%',
            marginTop: 4,
            backgroundColor: '#009FBD',
            color: 'white',
          }}
        >
          Save
        </Button>
      </Box>
    </Modal>
  );
};

export default AddEditQuestion;

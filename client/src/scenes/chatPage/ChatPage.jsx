import { Box } from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Navbar from 'scenes/navbar';
import ChatBox from './chatComponent/ChatBox';
import SideDrawer from './miscellaneous/SideDrawer';
import MyChat from './chatComponent/MyChat';

const ChatPage = () => {
  const user = useSelector((state) => state.user);
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <>
      <Navbar />
      <div style={{ width: '100%', height: `calc(100vh -' 80px')` }}>
        {user && <SideDrawer />}
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          width={'100%'}
          height={'86.5vh'}
          p={'10px'}
          sx={{
            background: '#525659',
          }}
        >
          {user && <MyChat />}
          {user && <ChatBox />}
        </Box>
      </div>
    </>
  );
};

export default ChatPage;

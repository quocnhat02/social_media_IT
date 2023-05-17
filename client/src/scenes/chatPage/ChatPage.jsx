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
      <div
        style={{
          width: '100%',
          height: `calc(100vh -' 80px')`,
        }}
      >
        {user && <SideDrawer />}
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          width={'100%'}
          height={'86.7vh'}
          p={'10px'}
          sx={{
            background: '#051926',
            fontSize: { sm: '15px', md: '12px', lg: '20px' },
          }}
        >
          {user && <MyChat fetchAgain={fetchAgain} />}
          {user && (
            <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          )}
        </Box>
      </div>
    </>
  );
};

export default ChatPage;

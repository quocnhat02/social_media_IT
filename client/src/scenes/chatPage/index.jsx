import React from 'react';
import {
  useMultiChatLogic,
  MultiChatSocket,
  MultiChatWindow,
} from 'react-chat-engine-advanced';
import Header from './CustomHeader';
import StandardMessageForm from './StandardMessageForm';
import Navbar from 'scenes/navbar';

const Chat = () => {
  const chatProps = useMultiChatLogic(
    '65b1bd8f-b44d-4160-903c-595702015eaf',
    'newuser',
    '1234'
  );

  return (
    <div style={{ flexBasis: '100%' }}>
      <Navbar />
      <MultiChatSocket {...chatProps} />
      <MultiChatWindow
        {...chatProps}
        style={{ height: `calc(100vh - 80px)` }}
        renderChatHeader={(chat) => <Header chat={chat} />}
        renderMessageForm={(props) => {
          return (
            <StandardMessageForm props={props} activeChat={chatProps.chat} />
          );
        }}
      />
    </div>
  );
};

export default Chat;

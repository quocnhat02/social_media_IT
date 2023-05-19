import { Avatar, Tooltip } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import ScrollableFeed from 'react-scrollable-feed';
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from 'utils/ChatLogic';

const ScrollableChat = ({ messages }) => {
  const user = useSelector((state) => state.user);

  return (
    <ScrollableFeed>
      {/* <div style={{ overflowX: 'hidden', overflowY: 'auto' }}> */}
      {messages &&
        messages.map((m, i) => (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
            key={m._id}
          >
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip
                label={`${m.sender.firstName}${m.sender.lastName}`}
                placement='bottom-start'
                arrow
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Avatar
                  sizes={'sm'}
                  cursor={'pointer'}
                  sx={{
                    cursor: 'pointer',
                    marginRight: 1,
                    marginBottom: '14px',
                  }}
                  name={`${m.sender.firstName}${m.sender.lastName}`}
                  // src={m.sender.picturePath}
                  src={`http://localhost:3001/assets/${m?.sender?.picturePath}`}
                />
              </Tooltip>
            )}
            <p
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? '#FF8400' : '#9A208C'
                }`,
                borderRadius: '15px',
                color: 'white',
                padding: '5px 20px',
                maxWidth: '75%',
                fontSize: '1.2rem',
                wordWrap: 'break-word',
                overflow: 'hidden',
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 2 : 8,
              }}
            >
              {m.content}
            </p>
          </div>
        ))}
      {/* </div> */}
    </ScrollableFeed>
  );
};

export default ScrollableChat;

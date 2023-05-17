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
          <div style={{ display: 'flex' }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip
                label={`${m.sender.firstName}${m.sender.firstName}`}
                placement='bottom-start'
                hasArrow
              >
                <Avatar
                  mt={'7px'}
                  mr={1}
                  size={'sm'}
                  cursor={'pointer'}
                  name={`${m.sender.firstName}${m.sender.firstName}`}
                  src={m.sender.picturePath}
                />
              </Tooltip>
            )}

            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? '#BEE3F8' : '#B9F5D0'
                }`,
                borderRadius: '20px',
                padding: '5px 15px',
                maxWidth: '75%',
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
      {/* </div> */}
    </ScrollableFeed>
  );
};

export default ScrollableChat;

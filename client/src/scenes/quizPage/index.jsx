import React from 'react';
import Exams from './exams';
import { Box, useMediaQuery } from '@mui/material';
import Navbar from 'scenes/navbar';
import { useSelector } from 'react-redux';
import UserWidget from 'scenes/widgets/UserWidget';
import FriendListWidget from 'scenes/widgets/FriendListWidget';
import WidgetWrapper from 'components/WidgetWrapper';

const QuizPage = () => {
  const user = useSelector((state) => state.user);

  const isNonMobileScreens = useMediaQuery('(min-width:1000px)');

  return (
    <Box>
      <Navbar />
      <Box
        width='100%'
        padding='2rem 6%'
        display={isNonMobileScreens ? 'flex' : 'block'}
        gap='2rem'
        justifyContent='center'
      >
        <Box flexBasis={isNonMobileScreens ? '22%' : undefined}>
          <UserWidget userId={user?._id} picturePath={user?.picturePath} />
          <Box m='2rem 0' />
          <FriendListWidget userId={user?._id} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? '75%' : undefined}
          mt={isNonMobileScreens ? undefined : '2rem'}
        >
          <WidgetWrapper>
            <Exams />
          </WidgetWrapper>
        </Box>
      </Box>
    </Box>
  );
};

export default QuizPage;

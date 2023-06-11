import {
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
  useMediaQuery,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Button } from 'react-chat-engine-advanced';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import PageTitle from '../quizComponent/PageTitle';
import Navbar from 'scenes/navbar';
import UserWidget from 'scenes/widgets/UserWidget';
import FriendListWidget from 'scenes/widgets/FriendListWidget';
import WidgetWrapper from 'components/WidgetWrapper';

const HomeQuizPage = () => {
  const [exams, setExams] = useState([]);
  const isNonMobileScreens = useMediaQuery('(min-width:1000px)');
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const fullName = `${user.firstName} ${user.lastName}`;
  const navigate = useNavigate();

  const getExams = async () => {
    const response = await fetch(
      `http://localhost:3001/api/exams/get-all-exams`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const data = await response.json();

    setExams(data.data);
  };
  useEffect(() => {
    getExams();
  }, []);

  const MuiCard = ({ exam }) => {
    return (
      <Box width={'300px'}>
        <Card>
          <CardContent>
            <Typography
              gutterBottom
              variant='h4'
              color={'green'}
              component='div'
            >
              {exam.name}
            </Typography>
            <hr />
            <Typography gutterBottom variant='h5' component='div'>
              Category: {exam.category}
            </Typography>
            <Typography gutterBottom variant='h5' component='div'>
              Total Marks: {exam.totalMarks}
            </Typography>
            <Typography gutterBottom variant='h5' component='div'>
              Passing Marks: {exam.passingMarks}
            </Typography>
            <Typography gutterBottom variant='h5' component='div'>
              Duration: {exam.duration}
            </Typography>
            <Button
              style={{
                width: '100%',
                border: 'none',
                background: 'yellow',
                marginTop: 4,
              }}
              onClick={() => navigate(`/user/write-exam/${exam._id}`)}
            >
              Start
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  };

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
            <PageTitle title={`Hi ${fullName}, Welcome to their Quiz`} />
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'auto auto auto',
                marginTop: 3,
                marginBottom: 2,
              }}
            >
              {exams.map((exam) => (
                <MuiCard key={exam._id} exam={exam} />
              ))}
            </Box>
          </WidgetWrapper>
        </Box>
      </Box>
    </Box>
  );
};

export default HomeQuizPage;

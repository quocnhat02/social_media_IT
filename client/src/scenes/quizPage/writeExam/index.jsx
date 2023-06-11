import { Box, Divider, useMediaQuery } from '@mui/material';
import WidgetWrapper from 'components/WidgetWrapper';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from 'scenes/navbar';
import FriendListWidget from 'scenes/widgets/FriendListWidget';
import UserWidget from 'scenes/widgets/UserWidget';
import Instructions from './Instructions';

const WriteExam = () => {
  const [examData, setExamData] = useState();
  const params = useParams();
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery('(min-width:1000px)');
  const user = useSelector((state) => state.user);
  const [view, setView] = useState('instructions');
  const [questions, setQuestions] = useState([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [result, setResult] = useState({});

  const navigate = useNavigate();

  const getExamData = async () => {
    const response = await fetch(
      `http://localhost:3001/api/exams/get-exam-by-id`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          examId: params?.id,
        }),
      }
    );
    const data = await response.json();
    setQuestions(data.data.questions);
    setExamData(data.data);
  };

  const calculateResult = () => {
    let correctAnswers = [];
    let wrongAnswers = [];

    questions.forEach((question, index) => {
      if (question.correctOption === selectedOptions[index]) {
        correctAnswers.push(question);
      } else {
        wrongAnswers.push(question);
      }
    });

    let verdict = 'Pass';
    if (correctAnswers.length < examData.passingMarks) {
      verdict = 'Fail';
    }
    setResult({
      correctAnswers,
      wrongAnswers,
      verdict,
    });
    setView('result');
  };

  useEffect(() => {
    if (params?.id) {
      getExamData();
    }
  }, []);

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
            {examData && (
              <div style={{ padding: 10, marginTop: 2, marginBottom: 5 }}>
                <Divider />
                <h1 style={{ textAlign: 'center' }}>{examData?.name}</h1>
                <Divider />
                {view === 'instructions' && (
                  <Instructions
                    examData={examData}
                    view={view}
                    setView={setView}
                  />
                )}

                {view === 'questions' && (
                  <div className='flex flex-col gap-2'>
                    <h1 className='text-2xl' style={{ color: 'yellow' }}>
                      {selectedQuestionIndex + 1} :{' '}
                      {questions[selectedQuestionIndex]?.name}
                    </h1>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 4,
                      }}
                    >
                      {Object.keys(
                        questions[selectedQuestionIndex].options
                      ).map((option, index) => {
                        return (
                          <div
                            className={`${
                              selectedOptions[selectedQuestionIndex] === option
                                ? 'selected-option'
                                : 'option'
                            }`}
                            key={index}
                            onClick={() => {
                              setSelectedOptions({
                                ...selectedOptions,
                                [selectedQuestionIndex]: option,
                              });
                            }}
                            style={{
                              marginTop: 3,
                              marginBottom: 3,
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 2,
                              alignItems: 'center',
                            }}
                          >
                            <h2 className='text-xl'>
                              {option} :{' '}
                              {questions[selectedQuestionIndex].options[option]}
                            </h2>
                          </div>
                        );
                      })}
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      {selectedQuestionIndex > 0 && (
                        <button
                          className='outline-indigo-600'
                          style={{
                            background: 'purple',
                            padding: '4px 8px',
                            width: '400px',
                            height: '50px',
                            marginTop: 5,
                          }}
                          onClick={() => {
                            setSelectedQuestionIndex(selectedQuestionIndex - 1);
                          }}
                        >
                          Previous
                        </button>
                      )}
                      {selectedQuestionIndex < questions.length - 1 && (
                        <button
                          className='outline-yellow-600'
                          style={{
                            background: '#fbc02d',
                            padding: '4px 8px',
                            width: '400px',
                            height: '50px',
                            marginTop: 5,
                            marginLeft: 'auto',
                          }}
                          onClick={() => {
                            setSelectedQuestionIndex(selectedQuestionIndex + 1);
                          }}
                        >
                          Next
                        </button>
                      )}

                      {selectedQuestionIndex === questions.length - 1 && (
                        <button
                          className='outline-yellow-600'
                          style={{
                            background: '#00FFCA',
                            padding: '4px 8px',
                            width: '400px',
                            height: '50px',
                            marginTop: 5,
                            marginLeft: 'auto',
                          }}
                          onClick={() => {
                            calculateResult();
                          }}
                        >
                          Submit
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {view === 'result' && (
                  <div>
                    <h2 className='text-2xl'>Result</h2>

                    <div className='marks'>
                      <h1 className='text-md'>
                        Total Marks: {examData.totalMarks}
                      </h1>
                      <h1 className='text-md'>
                        Obtained Marks:
                        {result.correctAnswers.length}
                      </h1>
                      <h1 className='text-md'>
                        Wrong Answers: {result.wrongAnswers.length}
                      </h1>
                      <h1 className='text-md'>VERDICT: {result.verdict}</h1>
                    </div>
                  </div>
                )}
              </div>
            )}
          </WidgetWrapper>
        </Box>
      </Box>
    </Box>
  );
};

export default WriteExam;

import React, { useEffect, useRef, useState } from 'react';
import PageTitle from '../quizComponent/PageTitle';
import { toast } from 'react-toastify';

import {
  Box,
  Button,
  Divider,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useSelector } from 'react-redux';
import Navbar from 'scenes/navbar';
import UserWidget from 'scenes/widgets/UserWidget';
import FriendListWidget from 'scenes/widgets/FriendListWidget';
import WidgetWrapper from 'components/WidgetWrapper';
import { ArrowBackIosNewOutlined } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

import Tab from '@mui/material/Tab';
import TabsNotification from 'components/TabsNotification';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const AddEditExam = () => {
  // const [examName, setExamName] = useState('');
  // const [examDuration, setExamDuration] = useState(0);
  // const [category, setCategory] = useState('');
  // const [totalMarks, setTotalMarks] = useState(0);
  // const [passingMarks, setPassingMarks] = useState(0);

  const examName = useRef('');
  const examDuration = useRef(0);
  const category = useRef('');
  const totalMarks = useRef(0);
  const passingMarks = useRef(0);

  const questionName = useRef('');
  const correctOption = useRef('');
  const A = useRef('');
  const B = useRef('');
  const C = useRef('');
  const D = useRef('');

  const [selectedQuestion, setSelectedQuestion] = useState();

  const navigate = useNavigate();
  const isNonMobileScreens = useMediaQuery('(min-width:1000px)');
  const [examData, setExamData] = useState();
  const params = useParams();
  const token = useSelector((state) => state.token);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelectedQuestion(null);
  };
  const [activeTab, setActiveTab] = useState(0);

  const onSubmitQuestion = async (e) => {
    e.preventDefault();
    if (selectedQuestion) {
      const response = await fetch(
        `http://localhost:3001/api/exams/edit-exam-by-id`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: questionName.current,
            correctOption: correctOption.current,
            options: {
              A: A.current,
              B: B.current,
              C: C.current,
              D: D.current,
            },
            examId: params?.id,
          }),
        }
      );
      const data = await response.json();
      if (data.success) {
        navigate('/admin/exams');
        toast({
          title: data.message,
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        handleClose();

        return;
      } else {
        toast({
          title: data.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        handleClose();

        return;
      }
    } else {
      const response = await fetch(
        `http://localhost:3001/api/exams/add-question-to-exam`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: questionName.current,
            correctOption: correctOption.current,
            options: {
              A: A.current,
              B: B.current,
              C: C.current,
              D: D.current,
            },
            exam: params?.id,
          }),
        }
      );
      const data = await response.json();
      if (data.success) {
        navigate('/admin/exams');
        toast({
          title: data.message,
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        handleClose();

        return;
      } else {
        toast({
          title: data.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        handleClose();

        return;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (params?.id) {
      const response = await fetch(
        `http://localhost:3001/api/exams/edit-exam-by-id`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            examId: params?.id,
            // name: examName,
            // duration: examDuration,
            // category,
            // totalMarks,
            // passingMarks,

            name: examName.current,
            duration: examDuration.current,
            category: category.current,
            totalMarks: totalMarks.current,
            passingMarks: passingMarks.current,
          }),
        }
      );
      const data = await response.json();
      if (data.success) {
        navigate('/admin/exams');
        toast({
          title: data.message,
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        return;
      } else {
        toast({
          title: data.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        return;
      }
    } else {
      const response = await fetch(`http://localhost:3001/api/exams/add`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // name: examName,
          // duration: examDuration,
          // category,
          // totalMarks,
          // passingMarks,

          name: examName.current,
          duration: examDuration.current,
          category: category.current,
          totalMarks: totalMarks.current,
          passingMarks: passingMarks.current,
        }),
      });
      const data = await response.json();
      if (data.success) {
        navigate('/admin/exams');
        toast({
          title: data.message,
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        return;
      } else {
        toast({
          title: data.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        return;
      }
    }
  };

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
    console.log(data);
    setExamData(data.data);
  };

  const deleteQuestion = async (questionId) => {
    const response = await fetch(
      `http://localhost:3001/api/exams/delete-question-by-id`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionId,
          examId: params?.id,
        }),
      }
    );
    getExamData();
  };

  useEffect(() => {
    if (params?.id) {
      getExamData();
    }
  }, []);

  const MuiTable = () => {
    return (
      <TableContainer component={Paper}>
        <Table aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell align='center'>Question Name</TableCell>
              <TableCell align='center'>Options</TableCell>
              <TableCell align='center'>Correct Option</TableCell>
              <TableCell align='center'>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {examData?.questions?.map((row) => (
              <TableRow
                key={row._id}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
              >
                <TableCell align='center'>{row.name}</TableCell>
                <TableCell align='center'>
                  {Object.keys(row.options).map((key) => {
                    return (
                      <div>
                        {key} : {row.options[key]}
                      </div>
                    );
                  })}
                </TableCell>
                <TableCell align='center'>
                  {row.correctOption} : {row.options[`${row.correctOption}`]}
                </TableCell>
                <TableCell align='center'>
                  <div className='flex gap-3'>
                    <IconButton
                      onClick={() => {
                        setSelectedQuestion(row);
                      }}
                    >
                      <EditOutlinedIcon />
                    </IconButton>
                    <IconButton onClick={() => deleteQuestion(row._id)}>
                      <DeleteOutlinedIcon />
                    </IconButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const tabs = [
    {
      name: 'ExamDetails',
      component: (
        <>
          {(examData || !params?.id) && (
            <>
              <form
                onSubmit={handleSubmit}
                style={
                  {
                    // display: 'grid',
                    // gridTemplateColumns: 'auto auto',
                    // gap: '20px',
                    // gridAutoFlow: 'column',
                  }
                }
              >
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'auto auto',
                    gap: '20px',
                    marginTop: 3,
                  }}
                >
                  <TextField
                    type='text'
                    label='Exam Name'
                    // value={examData?.name || ''}
                    variant='outlined'
                    // onChange={(e) => setExamName(e.target.value)}
                    onChange={(e) => (examName.current = e.target.value)}
                  />
                  <TextField
                    type='number'
                    label='Exam Duration'
                    // value={examData?.duration || ''}
                    variant='outlined'
                    // onChange={(e) => setExamDuration(e.target.value)}
                    onChange={(e) => (examDuration.current = e.target.value)}
                  />
                  <Box
                    // value={category}
                    // label='Category'
                    // onChange={handleChange}
                    sx={{
                      width: '100%',
                    }}
                  >
                    <TextField
                      label='Category'
                      select
                      // value={examData?.category || ''}
                      // onChange={handleChange}
                      onChange={(e) => (category.current = e.target.value)}
                      fullWidth
                    >
                      <MenuItem selected disabled value=''>
                        Select Category
                      </MenuItem>
                      <MenuItem value={'Javascript'}>Javascript</MenuItem>
                      <MenuItem value={'React'}>React</MenuItem>
                      <MenuItem value={'Node'}>Node</MenuItem>
                      <MenuItem value={'MongoDB'}>MongoDB</MenuItem>
                    </TextField>
                  </Box>

                  <TextField
                    type='number'
                    label='Total Marks'
                    // value={examData?.totalMarks || ''}
                    variant='outlined'
                    // onChange={(e) => setTotalMarks(e.target.value)}
                    onChange={(e) => (totalMarks.current = e.target.value)}
                  />
                  <TextField
                    type='number'
                    label='Passing Marks'
                    // value={examData?.passingMarks || ''}
                    variant='outlined'
                    // onChange={(e) => setPassingMarks(e.target.value)}
                    onChange={(e) => (passingMarks.current = e.target.value)}
                  />
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                  }}
                >
                  <Button
                    sx={{
                      display: 'flex',
                      width: '200px',
                      marginLeft: 'auto',
                      marginRight: 3,
                      backgroundColor: 'orange',
                      color: 'white',
                    }}
                    onClick={() => navigate('/admin/exams')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type='submit'
                    sx={{
                      display: 'flex',
                      width: '200px',
                      // marginLeft: 'auto',
                      backgroundColor: '#009FBD',
                      color: 'white',
                    }}
                  >
                    Save
                  </Button>
                </Box>
              </form>
            </>
          )}
        </>
      ),
    },

    {
      name: 'Questions',
      component: (
        <>
          <h1>Questions</h1>

          <Box
            sx={{
              display: 'flex',
              marginBottom: 3,
            }}
          >
            <Button
              sx={{
                display: 'flex',
                width: '200px',
                marginLeft: 'auto',
                marginRight: 3,
                backgroundColor: 'orange',
                color: 'white',
              }}
              onClick={() => navigate('/admin/exams')}
            >
              Cancel
            </Button>
            <Button
              sx={{
                display: 'flex',
                width: '200px',
                // marginLeft: 'auto',
                backgroundColor: '#009FBD',
                color: 'white',
              }}
              onClick={handleOpen}
            >
              Add Question
            </Button>

            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby='modal-modal-title'
              aria-describedby='modal-modal-description'
            >
              <Box sx={style}>
                <h2>{selectedQuestion ? 'Edit Question' : 'Add Questions'} </h2>
                <form onSubmit={onSubmitQuestion}>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'auto auto',
                      gap: '20px',
                      marginTop: 3,
                    }}
                  >
                    <TextField
                      type='text'
                      label='Question Name'
                      // value={examData?.name || ''}
                      variant='outlined'
                      // onChange={(e) => setExamName(e.target.value)}
                      onChange={(e) => (questionName.current = e.target.value)}
                    />
                    <TextField
                      type='text'
                      label='Correct Option'
                      // value={examData?.duration || ''}
                      variant='outlined'
                      // onChange={(e) => setExamDuration(e.target.value)}
                      onChange={(e) => (correctOption.current = e.target.value)}
                    />

                    <TextField
                      type='text'
                      label='Option A'
                      // value={examData?.totalMarks || ''}
                      variant='outlined'
                      // onChange={(e) => setTotalMarks(e.target.value)}
                      onChange={(e) => (A.current = e.target.value)}
                    />
                    <TextField
                      type='text'
                      label='Option B'
                      // value={examData?.totalMarks || ''}
                      variant='outlined'
                      // onChange={(e) => setTotalMarks(e.target.value)}
                      onChange={(e) => (B.current = e.target.value)}
                    />
                    <TextField
                      type='text'
                      label='Option C'
                      // value={examData?.totalMarks || ''}
                      variant='outlined'
                      // onChange={(e) => setTotalMarks(e.target.value)}
                      onChange={(e) => (C.current = e.target.value)}
                    />
                    <TextField
                      type='text'
                      label='Option D'
                      // value={examData?.totalMarks || ''}
                      variant='outlined'
                      // onChange={(e) => setTotalMarks(e.target.value)}
                      onChange={(e) => (D.current = e.target.value)}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      marginTop: 3,
                    }}
                  >
                    <Button
                      sx={{
                        display: 'flex',
                        width: '200px',
                        marginLeft: 'auto',
                        marginRight: 3,
                        backgroundColor: 'orange',
                        color: 'white',
                      }}
                      onClick={() => handleClose(true)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type='submit'
                      sx={{
                        display: 'flex',
                        width: '200px',
                        // marginLeft: 'auto',
                        backgroundColor: '#009FBD',
                        color: 'white',
                      }}
                    >
                      Save
                    </Button>
                  </Box>
                </form>
              </Box>
            </Modal>
          </Box>
          <MuiTable />
        </>
      ),
    },
  ];

  return (
    <Box>
      <Navbar />
      <Box
        width='100%'
        padding='2rem 6%'
        display={isNonMobileScreens ? 'flex' : 'block'}
        gap='2rem'
        justifyContent='center'
        alignItems={'center'}
      >
        <Box
          flexBasis={isNonMobileScreens ? '95%' : undefined}
          mt={isNonMobileScreens ? undefined : '2rem'}
        >
          <WidgetWrapper>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                marginBottom: 2,
              }}
            >
              <IconButton onClick={() => navigate('/admin/exams')}>
                <ArrowBackIosNewOutlined />
              </IconButton>
              <PageTitle title={params.id ? 'Edit Exam' : 'Add Exam'} />
            </Box>
            <Divider sx={{ marginBottom: 2 }}></Divider>

            {/* <form
              onSubmit={handleSubmit}
              style={
                {
                  // display: 'grid',
                  // gridTemplateColumns: 'auto auto',
                  // gap: '20px',
                  // gridAutoFlow: 'column',
                }
              }
            > */}
            <TabsNotification
              tabs={tabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            ></TabsNotification>
            {/* <TextField
                type='text'
                label='Exam Name'
                variant='outlined'
                onChange={(e) => setExamName(e.target.value)}
              />
              <TextField
                type='number'
                label='Exam Duration'
                variant='outlined'
                onChange={(e) => setExamDuration(e.target.value)}
              />
              <Select
                value={category}
                label='Category'
                onChange={handleChange}
                sx={{
                  width: '100%',
                }}
              >
                <MenuItem selected disabled value=''>
                  Select Category
                </MenuItem>
                <MenuItem value={'Javascript'}>Javascript</MenuItem>
                <MenuItem value={'React'}>React</MenuItem>
                <MenuItem value={'Node'}>Node</MenuItem>
                <MenuItem value={'MongoDB'}>MongoDB</MenuItem>
              </Select>

              <TextField
                type='number'
                label='Total Marks'
                variant='outlined'
                onChange={(e) => setTotalMarks(e.target.value)}
              />
              <TextField
                type='number'
                label='Passing Marks'
                variant='outlined'
                onChange={(e) => setPassingMarks(e.target.value)}
              /> */}
            {/* </form> */}
          </WidgetWrapper>
        </Box>
      </Box>
    </Box>
  );
};

export default AddEditExam;

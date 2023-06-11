import {
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import React, { useEffect, useState } from 'react';
import PageTitle from '../quizComponent/PageTitle';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Exams = () => {
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);

  const getAllExams = async () => {
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

  const deleteExam = async (examId) => {
    const response = await fetch(
      `http://localhost:3001/api/exams/delete-exam-by-id`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          examId,
        }),
      }
    );
    getAllExams();
  };

  useEffect(() => {
    getAllExams();
  }, []);

  const MuiTable = () => {
    return (
      <TableContainer component={Paper}>
        <Table aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell align='center'>Exam Name</TableCell>
              <TableCell align='center'>Duration</TableCell>
              <TableCell align='center'>Category</TableCell>
              <TableCell align='center'>Total Marks</TableCell>
              <TableCell align='center'>Passing Marks</TableCell>
              <TableCell align='center'>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {exams.map((row) => (
              <TableRow
                key={row._id}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
              >
                <TableCell align='center'>{row.name}</TableCell>
                <TableCell align='center'>{row.duration}</TableCell>
                <TableCell align='center'>{row.category}</TableCell>
                <TableCell align='center'>{row.totalMarks}</TableCell>
                <TableCell align='center'>{row.passingMarks}</TableCell>
                <TableCell align='center'>
                  <div className='flex gap-3'>
                    <IconButton
                      onClick={() => navigate(`/admin/exams/edit/${row._id}`)}
                    >
                      <EditOutlinedIcon />
                    </IconButton>
                    <IconButton onClick={() => deleteExam(row._id)}>
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

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <PageTitle title={'Exams'} />
        <Button
          className='outline-purple-500'
          onClick={() => navigate('/admin/exams/add')}
        >
          Add Exam
        </Button>
      </Box>
      <Divider
        sx={{
          marginBottom: 3,
          marginTop: 2,
        }}
      />
      <MuiTable />
    </>
  );
};

export default Exams;

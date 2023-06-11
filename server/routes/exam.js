import express from 'express';
import { verifyToken } from '../middlewares/auth.js';
import { Exam } from '../models/Exam.js';
import { Question } from '../models/Question.js';

const router = express.Router();

// add exam

router.post('/add', verifyToken, async (req, res) => {
  try {
    const examExist = await Exam.findOne({ name: req.body.name });
    if (examExist) {
      return res.status(400).send({
        message: 'Exam already exist',
        success: false,
      });
    }
    req.body.questions = [];

    const newExam = new Exam(req.body);
    await newExam.save();
    return res.status(201).send({
      success: true,
      message: 'Exam added successfully',
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
      data: error,
    });
  }
});

// get all exams
router.post('/get-all-exams', verifyToken, async (req, res) => {
  try {
    const exams = await Exam.find({});
    return res.status(200).send({
      success: true,
      data: exams,
      message: 'Exams fetched successfully',
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      data: error,
      message: error.message,
    });
  }
});

// get exam by id
router.post('/get-exam-by-id', verifyToken, async (req, res) => {
  try {
    const exams = await Exam.findById(req.body.examId).populate('questions');
    return res.status(200).send({
      success: true,
      data: exams,
      message: 'Exams fetched successfully',
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      data: error,
      message: error.message,
    });
  }
});

// edit exam by id
router.post('/edit-exam-by-id', verifyToken, async (req, res) => {
  try {
    const exams = await Exam.findByIdAndUpdate(req.body.examId, req.body);
    return res.status(200).send({
      success: true,
      message: 'Exams edited successfully',
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      data: error,
      message: error.message,
    });
  }
});

// delete exam by id
router.post('/delete-exam-by-id', verifyToken, async (req, res) => {
  try {
    await Exam.findByIdAndDelete(req.body.examId);
    return res.status(200).send({
      success: true,
      message: 'Exams deleted successfully',
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      data: error,
      message: error.message,
    });
  }
});

// add question to exam
router.post('/add-question-to-exam', verifyToken, async (req, res) => {
  try {
    // add question to Questions collection
    const newQuestion = new Question(req.body);
    const question = await newQuestion.save();

    //  add question to exam
    const exam = await Exam.findById(req.body.exam);
    console.log('body ', req.body);
    console.log('question ', JSON.stringify(question._id));
    // await exam.questions.push(JSON.stringify(question._id));
    const questionFind = await Question.findById(question._id);
    // await exam.questions.push('1234');
    await Exam.findByIdAndUpdate(
      { _id: req.body.exam },
      {
        $push: {
          questions: question._id,
        },
      }
    );
    // await exam.save();

    return res.status(201).send({
      success: true,
      message: 'Question added successfully',
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
      data: error,
    });
  }
});

// edit question in exam
router.post('/edit-question-in-exam', verifyToken, async (req, res) => {
  try {
    await Question.findByIdAndUpdate(req.body.questionId, req.body);
    return res.status(200).send({
      success: true,
      message: 'Question edited successfully',
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      data: error,
      message: error.message,
    });
  }
});

// delete question in exam
router.post('/delete-question-by-id', verifyToken, async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.body.questionId);

    // delete question in exam
    // const exam = await Exam.findById(req.body.examId);
    // exam.questions = await exam.questions.filter(
    //   (question) => question._id !== req.body.questionId
    // );
    // await exam.save();
    await Exam.findByIdAndUpdate(
      { _id: req.body.examId },
      {
        $pull: {
          questions: req.body.questionId,
        },
      }
    );

    return res.status(200).send({
      success: true,
      message: 'Question deleted successfully',
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      data: error,
      message: error.message,
    });
  }
});

export default router;

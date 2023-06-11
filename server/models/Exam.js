import mongoose from 'mongoose';

const examSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    passingMarks: {
      type: Number,
      required: true,
    },
    questions: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
      ],
      ref: 'Question',
      required: true,
      // type: Array,
      // default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Exam = mongoose.model('Exam', examSchema);

import React from 'react';
import { Button } from 'react-chat-engine-advanced';

const Instructions = ({ examData, view, setView }) => {
  return (
    <div className='flex flex-col items-center'>
      <ul className='flex-col gap-1'>
        <h2 className='text-2xl underline' style={{ textAlign: 'center' }}>
          Instructions
        </h2>
        <li>Exam must be completed in {examData.duration} seconds.</li>
        <li>
          Exam will be submitted automatically after {examData.duration}{' '}
          seconds.
        </li>
        <li>Once submitted, you cannot change your answer</li>
        <li>Do you refresh the page.</li>
        <li>
          You can use the <span className='font-bold'>"Previous"</span> and{' '}
          <span className='font-bold'>"Next"</span> buttons to navigate between
          questions.
        </li>
        <li>
          Total marks of the exam is{' '}
          <span className='font-bold'>{examData.totalMarks}</span>
        </li>
        <li>
          Passing marks of the exam is{' '}
          <span className='font-bold'>{examData.passingMarks}</span>
        </li>
      </ul>
      <div
        style={{
          display: 'flex',
          marginTop: 10,
          marginBottom: 10,
          width: '100%',
          justifyContent: 'center',
        }}
      >
        <button
          style={{
            width: '400px',
            height: '40px',
            borderRadius: '5px',
            background: 'green',
          }}
          onClick={() => setView('questions')}
        >
          Start Exam
        </button>
      </div>
    </div>
  );
};

export default Instructions;

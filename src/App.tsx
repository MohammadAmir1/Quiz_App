import React, { useState } from 'react';
import { fetchQuizQuestons } from './API'; // Corrected import statement
// Components
import QuestionCard from './components/QuestionCard';
// Types
import { QuestionState, Difficulty } from './API';
//styles
import { GlobalStyle, Wrapper } from './App.styles';
export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
};

const TOTAL_QUESTIONS = 10;

const App = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswer, setUserAnswer] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);

  console.log(questions);

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchQuizQuestons( // Corrected function name
      TOTAL_QUESTIONS,
      Difficulty.EASY
    );

    setQuestions(newQuestions);
    setScore(0);
    setUserAnswer([]);
    setNumber(0);
    setLoading(false);
  };

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      // User answer
      const answer = e.currentTarget.value;
      // Check answer against correct answer
      const correct = questions[number].correct_answer === answer;
      // Add score if the answer is correct
      if (correct) setScore((prev) => prev + 1);
      // Save the answer in the array for user answers
      const answerObject = {
        question: questions[number].question, // Corrected 'queston' to 'question'
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      setUserAnswer((prev) => [...prev, answerObject]);
    }
  };

  const nextQuestion = () => {
    // Increment the question number when the next button is clicked
    const nextQuestionNumber = number + 1;
    setNumber(nextQuestionNumber);

    // Check if the game is over (all questions answered)
    if (nextQuestionNumber === TOTAL_QUESTIONS - 1) {
      setGameOver(true);
    }
  };

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <h1>REACT QUIZ</h1>
        {gameOver || userAnswer.length === TOTAL_QUESTIONS ? (
          <button className='start' onClick={startTrivia}>
            Start
          </button>
        ) : null}
        {!gameOver ? <p className='score'>Score: {score}</p> : null} {/* Display the score */}
        {loading && <p>Loading Question ...</p>}
        {!loading && !gameOver && (
          <QuestionCard
            questionNr={number + 1}
            totalQuestions={TOTAL_QUESTIONS}
            question={questions[number].question}
            answers={questions[number].answers}
            userAnswer={userAnswer ? userAnswer[number] : undefined}
            callback={checkAnswer}
          />
        )}
        {!gameOver && !loading && userAnswer.length === number + 1 && number !== TOTAL_QUESTIONS - 1 ? (
          <button className='next' onClick={nextQuestion}>
            Next Question
          </button>
        ) : null}
      </Wrapper >
    </>
  );
};

export default App;

import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Alert } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";

const QuizPlayPage = () => {
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const questions = useMemo(() => quizData || [], [quizData]);
  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    const storedQuizData = JSON.parse(localStorage.getItem("quizData"));
    if (storedQuizData && storedQuizData.length) {
      setQuizData(storedQuizData);

      const totalQuestions = storedQuizData.length;
      const initialTime = totalQuestions <= 5 ? 4 * 60 : 8 * 60;
      setTimeLeft(initialTime);

      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    } else {
      navigate("/quiz-setup");
    }
  }, [navigate]);

  const handleAnswerChange = (value) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: value.trim().toLowerCase(),
    }));
  };

  const handleNext = () => {
    if (validateCurrentQuestion()) {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      }
    } else {
      showAlertMessage("Please select an option or enter an answer.");
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (validateAllQuestions()) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        calculateScore();
        navigate("/quiz-results");
      }, 2000);
    } else {
      showAlertMessage("Please answer all questions before submitting.");
    }
  };

  const validateCurrentQuestion = () => {
    const answer = userAnswers[currentQuestionIndex]?.trim();
    return answer !== undefined && answer !== "";
  };

  const validateAllQuestions = () => {
    return questions.every((_, index) => {
      const answer = userAnswers[index]?.trim();
      return answer !== undefined && answer !== "";
    });
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((question, index) => {
      const userAnswer = userAnswers[index]?.trim().toLowerCase() || "";
      const correctAnswer =
        question.type === "multiple"
          ? question.correct_answer.trim().toLowerCase()
          : question.correct_answer.trim().toLowerCase();

      if (
        (question.type === "multiple" && userAnswer === correctAnswer) ||
        (question.type === "boolean" && userAnswer === correctAnswer)
      ) {
        score += 1;
      }
    });
    localStorage.setItem("quizScore", score);
  };

  const showAlertMessage = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 4000);
  };

  if (loading) return <div>Loading...</div>;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="w-full h-auto py-8 flex flex-col items-center justify-center px-4 sm:px-8 text-xl">
      <Card className="w-full max-w-3xl border border-gray-300 rounded-lg shadow-xl p-4 bg-transparent">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-semibold">Quiz</h1>
          <p className="text-lg font-semibold border-b border-gray-300 pb-2 mb-2 shadow-xl">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>
        <div className="flex justify-between items-center mb-4 border-b border-gray-300 pb-4 shadow-md">
          <p className="text-lg font-semibold ml-4">
            Time Left:
            <span className="text-blue-500 ml-2">
              {minutes} M : {seconds < 10 ? `0${seconds}` : seconds} S
            </span>
          </p>
        </div>
        {showAlert && (
          <Alert color="failure" icon={HiInformationCircle}>
            <span className="font-medium">{alertMessage}</span>
          </Alert>
        )}
        {currentQuestion ? (
          <div className="mb-4">
            <p className="font-bold text-lg flex justify-center items-center border-b border-gray-300 pb-4 shadow-md">
              {currentQuestion.question}
            </p>
            {currentQuestion.type === "multiple" ? (
              <div className="mt-4">
                {currentQuestion.incorrect_answers
                  .concat(currentQuestion.correct_answer)
                  .sort()
                  .map((option, index) => (
                    <label key={index} className="block mt-2">
                      <input
                        type="radio"
                        name={`question-${currentQuestionIndex}`}
                        value={option}
                        checked={userAnswers[currentQuestionIndex] === option}
                        onChange={() => handleAnswerChange(option)}
                        className="mr-2"
                      />
                      {option}
                    </label>
                  ))}
              </div>
            ) : (
              <input
                type="text"
                value={userAnswers[currentQuestionIndex] || ""}
                onChange={(e) => handleAnswerChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 shadow-md"
                aria-label="Short answer"
              />
            )}
          </div>
        ) : (
          <div>No question available.</div>
        )}
        <div className="flex justify-between mt-4">
          <Button
            gradientMonochrome="purple"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          <Button
            gradientMonochrome="purple"
            onClick={handleNext}
            disabled={currentQuestionIndex === questions.length - 1}
          >
            Next
          </Button>
        </div>
        <div className="mt-4 flex justify-center">
          <Button
            gradientMonochrome="pink"
            onClick={handleSubmit}
            disabled={timeLeft === 0}
          >
            Submit
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default QuizPlayPage;

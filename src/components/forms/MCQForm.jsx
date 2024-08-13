import PropTypes from "prop-types";
import { Button, TextInput, Select } from "flowbite-react";

const MCQForm = ({
  options,
  correctAnswer,
  addOption,
  updateOption,
  deleteOption,
  setCurrentQuestion,
  currentQuestion,
}) => {
  return (
    <div className="flex flex-col items-center p-6 border rounded-lg shadow-lg bg-white w-full max-w-4xl mx-auto">
      <TextInput
        type="text"
        placeholder="Enter question (max 20 characters)"
        value={currentQuestion.question}
        onChange={(e) =>
          setCurrentQuestion((prev) => ({
            ...prev,
            question: e.target.value.slice(0, 20),
          }))
        }
        required
        className="mb-4 w-full"
      />

      <div className="flex flex-col space-y-4 w-full">
        {options.map((option, index) => (
          <div key={index} className="flex items-center space-x-2 w-full">
            <TextInput
              type="text"
              value={option}
              onChange={(e) => updateOption(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
              className="flex-1"
            />
            <Button
              gradientMonochrome="purple"
              onClick={() => deleteOption(index)}
              className="ml-2"
            >
              Delete
            </Button>
          </div>
        ))}
      </div>

      <Button
        gradientMonochrome="purple"
        onClick={addOption}
        disabled={options.length >= 4}
        className="mt-4 w-full"
      >
        Add Option
      </Button>

      <Select
        name="correctAnswer"
        value={correctAnswer}
        onChange={(e) =>
          setCurrentQuestion((prev) => ({
            ...prev,
            correctAnswer: e.target.value,
          }))
        }
        required
        className="mt-4 w-full"
      >
        <option value="">Select Correct Answer</option>
        {options.map((_, index) => (
          <option key={index} value={index}>
            Option {index + 1}
          </option>
        ))}
      </Select>
    </div>
  );
};

MCQForm.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  correctAnswer: PropTypes.string.isRequired,
  addOption: PropTypes.func.isRequired,
  updateOption: PropTypes.func.isRequired,
  deleteOption: PropTypes.func.isRequired,
  setCurrentQuestion: PropTypes.func.isRequired,
  currentQuestion: PropTypes.shape({
    question: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    correctAnswer: PropTypes.string.isRequired,
  }).isRequired,
};

export default MCQForm;

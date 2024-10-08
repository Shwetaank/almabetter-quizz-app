import { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Table } from "flowbite-react";
import Switch from "react-switch";
import { Link } from "react-router-dom";
import {
  HiOutlineArrowRight,
  HiOutlineEye,
  HiOutlineTrash,
} from "react-icons/hi";
import {
  loadQuizzes,
  deleteQuiz,
  toggleQuizStatus,
  setCurrentQuiz,
} from "../store/quizSlice";
import ConfirmDeleteModal from "../components/modal/ConfirmDeleteModal";
import QuizDetailModal from "../components/modal/QuizDetailModal";
import { useUser } from "@clerk/clerk-react";
import NoQuizzesAvailable from "../components/cards/NoQuizzesAvailable";
import { format } from "date-fns";
import { getQuizTypeLabel } from "../utils/getQuizTypeLabel";
import MyQuizzesTitleSwitcher from "../components/titleSwitcher/MyQuizzesTitleSwitcher";
import Spinner from "../components/spinner/Spinner";
import { motion } from "framer-motion";

// Variants for animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const MyQuizzes = () => {
  const dispatch = useDispatch();
  const quizzes = useSelector((state) => state.quiz.quizzes);
  const { user } = useUser();

  // Memoize quizzes to prevent unnecessary re-renders
  const memoizedQuizzes = useMemo(() => quizzes || [], [quizzes]);

  // State management for modals and loading
  const [modalOpen, setModalOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch quizzes on component mount
    const fetchQuizzes = async () => {
      try {
        await dispatch(loadQuizzes());
      } catch (error) {
        console.error("Failed to load quizzes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [dispatch]);

  // Handlers for delete and status toggle actions
  const handleDelete = useCallback(() => {
    if (quizToDelete !== null) {
      dispatch(deleteQuiz(quizToDelete));
      setModalOpen(false);
      setQuizToDelete(null);
    }
  }, [quizToDelete, dispatch]);

  const handleStatusToggle = useCallback(
    (id, currentStatus) => {
      dispatch(toggleQuizStatus({ id, status: !currentStatus }));
    },
    [dispatch]
  );

  const openDeleteModal = useCallback((id) => {
    setQuizToDelete(id);
    setModalOpen(true);
  }, []);

  const openViewModal = useCallback(
    (quiz) => {
      dispatch(setCurrentQuiz(quiz));
      setSelectedQuiz(quiz);
      setViewModalOpen(true);
    },
    [dispatch]
  );

  const closeViewModal = useCallback(() => {
    setViewModalOpen(false);
    setSelectedQuiz(null);
  }, []);

  // Helper function to format date
  const formatDate = (date) => {
    return format(new Date(date), "dd-MM-yy hh:mm a");
  };

  return (
    <motion.div
      className="w-full h-auto py-8 flex flex-col items-center justify-center px-4 sm:px-8 text-xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="w-full max-w-7xl border border-gray-300 rounded-lg shadow-lg"
        variants={itemVariants}
      >
        <div className="text-2xl sm:text-4xl font-semibold mb-8 text-center shadow-md">
          <MyQuizzesTitleSwitcher />
        </div>
        <div className="mr-10 mb-4 flex justify-end items-center">
          {memoizedQuizzes.length > 0 && (
            <Link to="/create-quiz">
              <Button
                gradientMonochrome="purple"
                className="font-bold transition-transform duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                Create Quiz
                <HiOutlineArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
        <p className="mb-6 text-center text-lg text-gray-600">
          Here you can find all the quizzes you&apos;ve created. You can manage
          them by <strong>deleting</strong>, <strong>changing</strong> their
          status. Click <strong>&quot;Create Quiz&quot;</strong> to add a new
          quiz to your collection.
        </p>
        {loading ? (
          <Spinner />
        ) : memoizedQuizzes.length > 0 ? (
          <motion.div
            className="overflow-x-auto"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <Table hoverable={true} className="min-w-full">
              <Table.Head>
                <Table.HeadCell className="text-center font-extrabold">
                  Number
                </Table.HeadCell>
                <Table.HeadCell className="text-center font-extrabold">
                  Type
                </Table.HeadCell>
                <Table.HeadCell className="text-center font-extrabold">
                  Title
                </Table.HeadCell>
                <Table.HeadCell className="text-center font-extrabold">
                  Status
                </Table.HeadCell>
                <Table.HeadCell className="text-center font-extrabold">
                  Date Created
                </Table.HeadCell>
                <Table.HeadCell className="text-center font-extrabold">
                  Author
                </Table.HeadCell>
                <Table.HeadCell className="text-center font-extrabold">
                  Actions
                </Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y font-semibold">
                {memoizedQuizzes.map((quiz, index) => (
                  <Table.Row key={quiz.id} className="shadow-lg">
                    <Table.Cell className="whitespace-nowrap text-center">
                      {index + 1}
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap text-center">
                      {getQuizTypeLabel(quiz.type)}
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap text-center">
                      <span
                        title={quiz.description || "No description available"}
                      >
                        {quiz.title}
                      </span>
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap text-center flex items-center justify-center">
                      <span
                        className={`mr-2 ${
                          quiz.active ? "text-purple-600" : "text-gray-500"
                        }`}
                      >
                        {quiz.active ? "Active" : "Inactive"}
                      </span>
                      <Switch
                        checked={quiz.active}
                        onChange={() =>
                          handleStatusToggle(quiz.id, quiz.active)
                        }
                        onColor="#6b7280"
                        offColor="#d1d5db"
                        onHandleColor="#ffffff"
                        offHandleColor="#ffffff"
                        handleDiameter={22}
                        uncheckedIcon={false}
                        checkedIcon={false}
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                        height={28}
                        width={48}
                        aria-label={`Toggle status for ${quiz.title}`}
                      />
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap text-center">
                      {formatDate(quiz.createdDate)}
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap text-center">
                      {user ? user.firstName : "Unknown"}
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap text-center flex items-center justify-center">
                      <Button
                        color="blue"
                        gradientMonochrome="purple"
                        onClick={() => openViewModal(quiz)}
                        className="mr-2 w-full hover:bg-blue-700"
                      >
                        <HiOutlineEye className="h-5 w-5" />
                      </Button>
                      <Button
                        color="red"
                        gradientMonochrome="purple"
                        onClick={() => openDeleteModal(quiz.id)}
                        className="w-full hover:bg-red-700"
                      >
                        <HiOutlineTrash className="h-5 w-5" />
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </motion.div>
        ) : (
          <NoQuizzesAvailable />
        )}
      </motion.div>
      {/* Modals for delete confirmation and quiz details */}
      <ConfirmDeleteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleDelete}
        gradientMonochrome="purple"
      />
      <QuizDetailModal
        isOpen={viewModalOpen}
        onClose={closeViewModal}
        quiz={selectedQuiz}
      />
    </motion.div>
  );
};

export default MyQuizzes;

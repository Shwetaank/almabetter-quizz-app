import { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Card, Button } from "flowbite-react";
import { HiOutlineArrowRight } from "react-icons/hi";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SurpriseQuizzModal from "../components/modal/SurpriseQuizzModal";
import img1 from "../assets/PlayQuiz.jpg";
import img2 from "../assets/ActiveQuizz.jpg";
import img3 from "../assets/SurpriseQuiz.jpg";

const cards = [
  {
    to: "/play-quiz",
    imageSrc: img1,
    title: "Play Quiz",
    description:
      "Engage in a dynamic quiz experience and test your knowledge across various subjects. Perfect for expanding your expertise and challenging yourself further.",
  },
  {
    to: "/my-quizzes",
    imageSrc: img2,
    title: "Active Quizzes",
    description:
      "Manage and track your ongoing quizzes with ease. Continue from where you left off and monitor your progress with our user-friendly interface.",
  },
  {
    to: "/surprise-quiz-form",
    imageSrc: img3,
    title: "Surprise Quiz",
    description:
      "Immerse yourself in the excitement of our Surprise Quiz, powered by the <strong>Trivia API</strong>. Put your skills to the test with a diverse array of unpredictable questions.",
  },
];

const Home = () => {
  const { isSignedIn } = useUser();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-100 to-red-100">
      <Header />

      <main className="flex-grow w-full max-w-7xl p-2 mx-auto my-8">
        <h1 className="text-2xl sm:text-4xl font-semibold mb-6 text-center">
          Welcome to <span className="font-bold">Alma</span>
          <span className="relative font-bold inline-block -translate-y-1 underline decoration-red-500">
            Better
          </span>{" "}
          Quiz App
        </h1>
        <p className="text-lg sm:text-xl mb-8 text-center">
          Expand your knowledge base and uncover new perspectives daily through
          engaging quizzes designed to challenge and educate.
        </p>
        <div className="flex flex-col md:flex-row justify-center items-center gap-10">
          {cards.map(
            (card, index) =>
              (card.condition === undefined ||
                (card.condition && isSignedIn)) && (
                <motion.div
                  key={index}
                  className="w-full sm:w-full lg:w-1/3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <Card className="w-full bg-transparent transform transition-transform duration-300 hover:scale-105">
                    <img
                      src={card.imageSrc}
                      alt={card.title}
                      className="w-full h-40 object-cover rounded-t-lg"
                    />
                    <div className="p-4">
                      <h5 className="text-xl font-bold tracking-tight flex justify-start cursor-pointer hover:underline">
                        {card.title}
                      </h5>
                      <p
                        className="font-normal text-gray-700 dark:text-gray-400 mt-2 text-justify"
                        dangerouslySetInnerHTML={{
                          __html: card.description.replace(/'/g, "&#39;"),
                        }}
                      />
                      <div className="mt-8 flex justify-center">
                        {card.to === "/surprise-quiz-form" ? (
                          <Button
                            gradientMonochrome="purple"
                            className="font-bold transition-transform duration-300 transform hover:scale-105 hover:shadow-lg"
                            onClick={() => setShowModal(true)}
                          >
                            Get Started
                            <HiOutlineArrowRight className="ml-2 h-5 w-5" />
                          </Button>
                        ) : (
                          <Link to={card.to}>
                            <Button
                              gradientMonochrome="purple"
                              className="font-bold transition-transform duration-300 transform hover:scale-105 hover:shadow-lg"
                            >
                              Get Started
                              <HiOutlineArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
          )}
        </div>
      </main>

      <Footer />
      <SurpriseQuizzModal showModal={showModal} setShowModal={setShowModal} />
    </div>
  );
};

export default Home;

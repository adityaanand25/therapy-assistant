import { useState, useEffect } from 'react';
import { Timer } from './Timer';
import { ProgressBar } from './ProgressBar';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation?: string;
}

const mockTests: Record<string, Question[]> = {
  jee: [
    {
      id: '1',
      text: 'In a photoelectric effect experiment, doubling the frequency of incident radiation will:',
      options: [
        'Double the kinetic energy of photoelectrons',
        'Quadruple the kinetic energy of photoelectrons',
        'Not affect the kinetic energy of photoelectrons',
        'Halve the kinetic energy of photoelectrons'
      ],
      correctAnswer: 0,
      difficulty: 'medium',
      explanation: 'The kinetic energy of photoelectrons is directly proportional to the frequency of incident radiation minus the threshold frequency.'
    },
    {
      id: '2',
      text: 'The pH of a 0.1M acetic acid solution is 4.8. What is the ionization constant (Ka) of acetic acid?',
      options: [
        '1.0 × 10⁻⁴',
        '1.6 × 10⁻⁵',
        '2.5 × 10⁻⁵',
        '3.2 × 10⁻⁵'
      ],
      correctAnswer: 1,
      difficulty: 'hard',
      explanation: 'Using pH = -log[H⁺] and Ka = [H⁺][CH₃COO⁻]/[CH₃COOH], we can calculate Ka = 1.6 × 10⁻⁵'
    },
    {
      id: '3',
      text: 'Which quantum number determines the shape of an orbital?',
      options: [
        'Principal quantum number (n)',
        'Azimuthal quantum number (l)',
        'Magnetic quantum number (m)',
        'Spin quantum number (s)'
      ],
      correctAnswer: 1,
      difficulty: 'easy',
      explanation: 'The azimuthal quantum number (l) determines the shape of the orbital (s, p, d, f).'
    }
  ],
  neet: [
    {
      id: '1',
      text: 'Which of the following is NOT a function of the liver?',
      options: [
        'Protein synthesis',
        'Bile production',
        'Insulin production',
        'Glycogen storage'
      ],
      correctAnswer: 2,
      difficulty: 'easy',
      explanation: 'Insulin is produced by the pancreas, not the liver.'
    },
    {
      id: '2',
      text: 'During muscle contraction, ATP is required for:',
      options: [
        'Attachment of myosin to actin',
        'Detachment of myosin from actin',
        'Formation of actomyosin',
        'Movement of tropomyosin'
      ],
      correctAnswer: 1,
      difficulty: 'medium',
      explanation: 'ATP is required for the detachment of myosin from actin during muscle contraction.'
    }
  ],
  upsc: [
    {
      id: '1',
      text: 'Which article of the Indian Constitution deals with the appointment of the Prime Minister?',
      options: [
        'Article 74',
        'Article 75',
        'Article 76',
        'Article 78'
      ],
      correctAnswer: 1,
      difficulty: 'medium',
      explanation: 'Article 75 of the Indian Constitution deals with the appointment of the Prime Minister.'
    },
    {
      id: '2',
      text: 'The concept of "Welfare State" in the Indian Constitution is enshrined in:',
      options: [
        'The Preamble',
        'The Fundamental Rights',
        'The Directive Principles',
        'The Fundamental Duties'
      ],
      correctAnswer: 2,
      difficulty: 'hard',
      explanation: 'The Directive Principles of State Policy enshrine the concept of a Welfare State.'
    }
  ],
  gate: [
    {
      id: '1',
      text: 'What is the time complexity of binary search?',
      options: [
        'O(n)',
        'O(log n)',
        'O(n log n)',
        'O(n²)'
      ],
      correctAnswer: 1,
      difficulty: 'easy',
      explanation: 'Binary search has a time complexity of O(log n) as it divides the search space in half at each step.'
    },
    {
      id: '2',
      text: 'Which of the following is NOT a valid deadlock prevention technique?',
      options: [
        'Resource ordering',
        'Banker\'s algorithm',
        'Resource allocation graph',
        'Priority inheritance'
      ],
      correctAnswer: 2,
      difficulty: 'medium',
      explanation: 'Resource allocation graph is used for deadlock detection, not prevention.'
    }
  ],
  nda: [
    {
      id: '1',
      text: 'If sin θ + cos θ = 1, then sin³ θ + cos³ θ = ?',
      options: [
        '1',
        '0',
        '2',
        '3'
      ],
      correctAnswer: 0,
      difficulty: 'easy',
      explanation: 'Using the identity sin θ + cos θ = 1, we can deduce that sin³ θ + cos³ θ = 1.'
    },
    {
      id: '2',
      text: 'Who was the first Chief of Defence Staff of India?',
      options: [
        'General Bipin Rawat',
        'General M.M. Naravane',
        'Air Chief Marshal B.S. Dhanoa',
        'Admiral Karambir Singh'
      ],
      correctAnswer: 0,
      difficulty: 'medium',
      explanation: 'General Bipin Rawat was appointed as the first Chief of Defence Staff of India.'
    }
  ],
  cds: [
    {
      id: '1',
      text: 'Which mountain range separates Europe from Asia?',
      options: [
        'Alps',
        'Andes',
        'Urals',
        'Himalayas'
      ],
      correctAnswer: 2,
      difficulty: 'easy',
      explanation: 'The Ural Mountains form the natural boundary between Europe and Asia.'
    },
    {
      id: '2',
      text: 'Who wrote "Wings of Fire: An Autobiography"?',
      options: [
        'Vikram Sarabhai',
        'A.P.J. Abdul Kalam',
        'C.V. Raman',
        'Homi Bhabha'
      ],
      correctAnswer: 1,
      difficulty: 'medium',
      explanation: '"Wings of Fire" is an autobiography of A.P.J. Abdul Kalam.'
    }
  ]
};

interface MockTestProps {
  examId: string;
  onClose: () => void;
  onComplete: (score: number) => void;
}

export function MockTest({ examId, onClose, onComplete }: MockTestProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const questions = mockTests[examId] || [];
  const progress = (currentQuestion / questions.length) * 100;

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    return answers.reduce((score, answer, index) => {
      return score + (answer === questions[index].correctAnswer ? 1 : 0);
    }, 0);
  };

  const getDifficultyColor = (difficulty: Question['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'hard': return 'text-red-500';
      default: return '';
    }
  };

  useEffect(() => {
    if (timeUp && !showResults) {
      setShowResults(true);
    }
  }, [timeUp, showResults]);

  if (showReview) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm z-50">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6">Review Answers</h2>
          <div className="space-y-8">
            {questions.map((question, index) => (
              <div key={question.id} className={`p-4 rounded-lg border ${
                answers[index] === question.correctAnswer 
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-red-500 bg-red-50 dark:bg-red-900/20'
              }`}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Question {index + 1}</span>
                  <span className={getDifficultyColor(question.difficulty)}>
                    {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                  </span>
                </div>
                <p className="mb-4">{question.text}</p>
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className={`p-2 rounded ${
                      optionIndex === question.correctAnswer
                        ? 'bg-green-100 dark:bg-green-900/40'
                        : optionIndex === answers[index]
                          ? 'bg-red-100 dark:bg-red-900/40'
                          : 'bg-gray-50 dark:bg-gray-700/40'
                    }`}>
                      {option}
                    </div>
                  ))}
                </div>
                {question.explanation && (
                  <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                    <strong>Explanation:</strong> {question.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="sticky bottom-0 bg-white dark:bg-gray-800 pt-4 mt-6 border-t">
            <button
              onClick={() => setShowReview(false)}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Back to Results
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const totalQuestions = questions.length;
    const percentage = (score / totalQuestions) * 100;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm z-50">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4">Test Results</h2>
          <div className="space-y-4">
            <p className="text-lg">Score: {score}/{totalQuestions}</p>
            <ProgressBar 
              percentage={percentage} 
              color={percentage >= 70 ? "green" : percentage >= 40 ? "yellow" : "red"} 
            />
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-green-500 font-bold">{
                  questions.filter((_, i) => answers[i] === questions[i].correctAnswer).length
                }</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Correct</div>
              </div>
              <div>
                <div className="text-red-500 font-bold">{
                  questions.filter((_, i) => answers[i] !== undefined && answers[i] !== questions[i].correctAnswer).length
                }</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Incorrect</div>
              </div>
              <div>
                <div className="text-yellow-500 font-bold">{
                  questions.filter((_, i) => answers[i] === undefined).length
                }</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Unattempted</div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowReview(true)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Review Answers
              </button>
              <button
                onClick={() => {
                  onComplete(score);
                  onClose();
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl max-w-2xl w-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Mock Test</h2>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Question {currentQuestion + 1} of {questions.length}
            </div>
          </div>
          <Timer onTimeUp={() => setTimeUp(true)} />
        </div>

        <div className="mb-4">
          <ProgressBar percentage={progress} />
        </div>

        {questions[currentQuestion] && (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <p className="text-lg">{questions[currentQuestion].text}</p>
              <span className={`ml-2 text-sm ${getDifficultyColor(questions[currentQuestion].difficulty)}`}>
                {questions[currentQuestion].difficulty.charAt(0).toUpperCase() + 
                 questions[currentQuestion].difficulty.slice(1)}
              </span>
            </div>
            <div className="space-y-2">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className="w-full p-4 text-left border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  if (currentQuestion < questions.length - 1) {
                    setCurrentQuestion(currentQuestion + 1);
                  } else {
                    setShowResults(true);
                  }
                }}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
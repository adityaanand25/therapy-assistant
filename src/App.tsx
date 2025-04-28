import { useState, useRef, useEffect } from "react";
import { Heart, ShieldCheck, Brain, Bot, LogOut, Calendar, Award } from "lucide-react";
import { ChatMessage } from "./components/ChatMessage";
import { ChatInput } from "./components/ChatInput";
import { ExamDropdown } from "./components/ExamDropdown";
import { ThemeToggle } from "./components/ThemeToggle";
import { AuthPage } from "./components/AuthPage";
import { TopicSidebar } from "./components/TopicSidebar";
import { Timer } from "./components/Timer";
import { MockTest } from "./components/MockTest";
import { getChatResponse } from "./lib/gemini";
import { authService } from "./lib/authService";
import type { Message, ChatState } from "./types";

interface Topic {
  id: string;
  name: string;
  timestamp: Date;
  completed?: boolean;
}

interface StudyStats {
  topicsCompleted: number;
  totalStudyTime: number;
  examName: string;
  lastStudied: Date;
}

const initialMessage: Message = {
  id: "1",
  content: "Hi! I'll help you prepare for your exam. What would you like to know about?",
  role: "assistant",
  timestamp: new Date(),
};

function App() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [selectedExam, setSelectedExam] = useState<{ id: string; name: string; color: string } | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [studyStats, setStudyStats] = useState<StudyStats[]>([]);
  const [showStats, setShowStats] = useState(false);
  const [showMockTest, setShowMockTest] = useState(false);
  const [mockTestScore, setMockTestScore] = useState<number | null>(null);
  const [state, setState] = useState<ChatState>({
    messages: [initialMessage],
    isTyping: false,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date(),
    };

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isTyping: true,
    }));

    try {
      const aiResponse = await getChatResponse(content);

      // Add topic if message seems to be about a new topic
      if (content.toLowerCase().includes('about') || content.toLowerCase().includes('explain') || content.toLowerCase().includes('what is')) {
        const topicName = content.length > 30 ? content.substring(0, 30) + '...' : content;
        setTopics(prev => [...prev, {
          id: Date.now().toString(),
          name: topicName,
          timestamp: new Date()
        }]);
      }

      const response: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: "assistant",
        timestamp: new Date(),
      };

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, response],
        isTyping: false,
      }));
    } catch (error) {
      console.error("Error in chat:", error);
      setState((prev) => ({
        ...prev,
        isTyping: false,
      }));
    }
  };

  const handleExamSelect = (exam: { id: string; name: string; color: string }) => {
    setSelectedExam(exam);
    // Reset topics and chat when changing exams
    setTopics([]);
    setState({
      messages: [{
        id: "1",
        content: `Welcome! I'm here to help you prepare for ${exam.name}. What specific topics would you like to discuss?`,
        role: "assistant",
        timestamp: new Date(),
      }],
      isTyping: false,
    });
  };

  const handleAuth = (email: string) => {
    setUserEmail(email);
  };

  const handleLogout = () => {
    if (userEmail) {
      authService.logout(userEmail);
      setUserEmail(null);
      setSelectedExam(null);
    }
  };

  const handleAddTopic = (topic: Omit<Topic, 'id'>) => {
    setTopics(prev => [...prev, {
      ...topic,
      id: Date.now().toString()
    }]);
  };

  const handleToggleTopic = (topicId: string) => {
    setTopics(prev => prev.map(topic => 
      topic.id === topicId 
        ? { ...topic, completed: !topic.completed }
        : topic
    ));
  };

  const handleMockTestStart = () => {
    setShowMockTest(true);
  };

  const handleMockTestComplete = (score: number) => {
    setMockTestScore(score);
    setShowMockTest(false);
    // Update study stats with mock test result
    setStudyStats(prev => {
      const existingStat = prev.find(stat => stat.examName === selectedExam?.name);
      if (existingStat) {
        return prev.map(stat => 
          stat.examName === selectedExam?.name 
            ? { ...stat, lastStudied: new Date() }
            : stat
        );
      }
      return [...prev, {
        examName: selectedExam?.name || '',
        topicsCompleted: topics.filter(t => t.completed).length,
        totalStudyTime: 0,
        lastStudied: new Date()
      }];
    });
  };

  const handleMockTestClose = () => {
    setShowMockTest(false);
  };

  if (!userEmail) {
    return <AuthPage onAuth={handleAuth} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 dark:from-gray-900 dark:to-gray-800 dark:text-white pattern-grid">
      <header className="bg-white/90 dark:bg-gray-800/90 shadow-md py-4 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Heart className="text-rose-600 w-8 h-8 animate-pulse" />
            <span className="bg-gradient-to-r from-rose-600 to-pink-500 text-transparent bg-clip-text">
              EduChat AI
            </span>
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span className="text-sm">Secure & Private</span>
            </div>
            <div className="flex items-center gap-1">
              <Brain className="w-5 h-5 text-blue-600" />
              <span className="text-sm">AI-Powered Support</span>
            </div>
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
              aria-label="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {!selectedExam ? (
          <div className="flex flex-col items-center justify-center space-y-8 py-10 opacity-0 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-center">Select Your Exam to Get Started</h2>
            <p className="text-center text-gray-600 dark:text-gray-400 max-w-2xl mb-8">
              Choose your exam from the options below to access personalized AI assistance for your preparation journey
            </p>
            {studyStats.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
                {studyStats.map((stat) => (
                  <div key={stat.examName} className="bg-white/90 dark:bg-gray-800/90 p-4 rounded-lg shadow-sm backdrop-blur-sm hover-lift">
                    <h3 className="font-medium text-gray-900 dark:text-white">{stat.examName}</h3>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Topics Completed: {stat.topicsCompleted}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Study Time: {Math.round(stat.totalStudyTime / 3600)}h {Math.round((stat.totalStudyTime % 3600) / 60)}m
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Last Studied: {stat.lastStudied.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="bg-exam-pattern p-8 rounded-2xl w-full">
              <ExamDropdown onExamSelect={handleExamSelect} />
            </div>
          </div>
        ) : (
          <div className="bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 animate-fade-in-up backdrop-blur-sm">
            {showMockTest ? (
              <div className="flex justify-center items-center min-h-[600px] p-6">
                <div className="w-full max-w-3xl">
                  <MockTest 
                    examId={selectedExam.id.toLowerCase()} 
                    onClose={handleMockTestClose}
                    onComplete={handleMockTestComplete}
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="font-medium">Currently preparing for:</span>
                      <span className="text-blue-600 dark:text-blue-400 font-semibold">{selectedExam.name}</span>
                      <button
                        onClick={() => setSelectedExam(null)}
                        className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                      >
                        Change Exam
                      </button>
                    </div>
                    <Timer />
                    <div className="flex items-center gap-4">
                      <button
                        onClick={handleMockTestStart}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Take Mock Test
                      </button>
                      {mockTestScore !== null && (
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Last Mock Test Score: {mockTestScore}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex gap-4">
                    <button
                      onClick={() => setShowStats(!showStats)}
                      className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                    >
                      <Award className="w-4 h-4" />
                      <span>View Progress</span>
                    </button>
                    <button
                      onClick={() => {
                        const element = document.createElement('a');
                        const text = state.messages.map(m => `${m.role}: ${m.content}\n`).join('\n');
                        const file = new Blob([text], { type: 'text/plain' });
                        element.href = URL.createObjectURL(file);
                        element.download = `${selectedExam.name}_chat_${new Date().toISOString().split('T')[0]}.txt`;
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);
                      }}
                      className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Save Chat</span>
                    </button>
                  </div>
                </div>
                
                {showStats && (
                  <div className="border-b border-gray-200 dark:border-gray-700 p-4 bg-gray-50/90 dark:bg-gray-900/90 backdrop-blur-sm">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white/90 dark:bg-gray-800/90 p-4 rounded-lg hover-lift backdrop-blur-sm">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">Topics Covered</h3>
                        <p className="mt-2 text-2xl font-semibold text-blue-600">{topics.length}</p>
                      </div>
                      <div className="bg-white/90 dark:bg-gray-800/90 p-4 rounded-lg hover-lift backdrop-blur-sm">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">Topics Completed</h3>
                        <p className="mt-2 text-2xl font-semibold text-green-600">
                          {topics.filter(t => t.completed).length}
                        </p>
                      </div>
                      <div className="bg-white/90 dark:bg-gray-800/90 p-4 rounded-lg hover-lift backdrop-blur-sm">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">Progress</h3>
                        <p className="mt-2 text-2xl font-semibold text-purple-600">
                          {topics.length > 0 
                            ? Math.round((topics.filter(t => t.completed).length / topics.length) * 100)
                            : 0}%
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex bg-chat-pattern">
                  <div className="flex-1">
                    <div className="h-[600px] overflow-y-auto p-6 space-y-6">
                      {state.messages.map((message) => (
                        <ChatMessage key={message.id} message={message} />
                      ))}
                      {state.isTyping && (
                        <div className="flex gap-2 items-center text-gray-500 dark:text-gray-400 animate-pulse">
                          <Bot className="w-8 h-8 text-blue-500" />
                          <div className="typing-indicator">
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900">
                      <ChatInput onSend={handleSendMessage} disabled={state.isTyping} />
                    </div>
                  </div>
                  
                  <TopicSidebar 
                    topics={topics} 
                    currentExam={selectedExam.id} 
                    onAddTopic={handleAddTopic}
                    onToggleTopic={handleToggleTopic}
                  />
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

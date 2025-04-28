import { BookOpen, Plus, X, CheckSquare, Square, FolderOpen } from 'lucide-react';
import { useState } from 'react';
import { ProgressBar } from './ProgressBar';

interface Topic {
  id: string;
  name: string;
  timestamp: Date;
  completed?: boolean;
  category?: string;
}

interface TopicSidebarProps {
  topics: Topic[];
  currentExam: string;
  onAddTopic?: (topic: Omit<Topic, 'id'>) => void;
  onToggleTopic?: (topicId: string) => void;
}

export function TopicSidebar({ topics, currentExam, onAddTopic, onToggleTopic }: TopicSidebarProps) {
  const [isAddingTopic, setIsAddingTopic] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newCategory, setNewCategory] = useState('');

  // Demo topics with categories
  const demoTopics: Record<string, Topic[]> = {
    jee: [
      { id: '1', name: 'Physics - Mechanics', timestamp: new Date(), completed: false, category: 'Physics' },
      { id: '2', name: 'Chemistry - Organic', timestamp: new Date(), completed: false, category: 'Chemistry' },
      { id: '3', name: 'Maths - Calculus', timestamp: new Date(), completed: false, category: 'Mathematics' },
      { id: '4', name: 'Physics - Thermodynamics', timestamp: new Date(), completed: false, category: 'Physics' },
      { id: '5', name: 'Chemistry - Inorganic', timestamp: new Date(), completed: false, category: 'Chemistry' },
    ],
    neet: [
      { id: '1', name: 'Biology - Human Anatomy', timestamp: new Date(), completed: false, category: 'Biology' },
      { id: '2', name: 'Physics - Optics', timestamp: new Date(), completed: false, category: 'Physics' },
      { id: '3', name: 'Chemistry - Biochemistry', timestamp: new Date(), completed: false, category: 'Chemistry' },
    ],
    upsc: [
      { id: '1', name: 'Indian History', timestamp: new Date(), completed: false, category: 'History' },
      { id: '2', name: 'Geography', timestamp: new Date(), completed: false, category: 'Geography' },
      { id: '3', name: 'Current Affairs', timestamp: new Date(), completed: false, category: 'General Knowledge' },
    ],
    gate: [
      { id: '1', name: 'Digital Logic', timestamp: new Date(), completed: false, category: 'Computer Science' },
      { id: '2', name: 'Computer Networks', timestamp: new Date(), completed: false, category: 'Computer Science' },
      { id: '3', name: 'Operating Systems', timestamp: new Date(), completed: false, category: 'Computer Science' },
    ],
    nda: [
      { id: '1', name: 'Mathematics', timestamp: new Date(), completed: false, category: 'Mathematics' },
      { id: '2', name: 'General Ability Test', timestamp: new Date(), completed: false, category: 'General Knowledge' },
      { id: '3', name: 'English', timestamp: new Date(), completed: false, category: 'Language' },
    ],
    cds: [
      { id: '1', name: 'Military Aptitude', timestamp: new Date(), completed: false, category: 'Military' },
      { id: '2', name: 'General Knowledge', timestamp: new Date(), completed: false, category: 'General Knowledge' },
      { id: '3', name: 'English', timestamp: new Date(), completed: false, category: 'Language' },
    ],
  };

  const displayTopics = topics.length > 0 ? topics : (demoTopics[currentExam] || []);

  // Calculate progress
  const completedCount = displayTopics.filter(t => t.completed).length;
  const progressPercentage = displayTopics.length > 0 
    ? Math.round((completedCount / displayTopics.length) * 100)
    : 0;

  // Get unique categories
  const categories = ['all', ...new Set(displayTopics.map(t => t.category || 'Uncategorized'))];

  // Filter topics by category
  const filteredTopics = selectedCategory === 'all'
    ? displayTopics
    : displayTopics.filter(t => t.category === selectedCategory);

  const handleAddTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTopicName.trim()) {
      onAddTopic?.({
        name: newTopicName.trim(),
        timestamp: new Date(),
        completed: false,
        category: newCategory || 'Uncategorized'
      });
      setNewTopicName('');
      setNewCategory('');
      setIsAddingTopic(false);
    }
  };

  return (
    <div className="w-64 bg-gray-50/90 dark:bg-gray-800/90 border-l border-gray-200 dark:border-gray-700 p-4 backdrop-blur-sm">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between bg-white/50 dark:bg-gray-700/50 p-3 rounded-lg backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Topics</h3>
          </div>
          <button
            onClick={() => setIsAddingTopic(true)}
            className="p-1 rounded-full hover:bg-gray-200/80 dark:hover:bg-gray-600/80 transition-colors text-gray-600 dark:text-gray-400"
            aria-label="Add topic"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-2 bg-white/50 dark:bg-gray-700/50 p-3 rounded-lg backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">{progressPercentage}%</span>
          </div>
          <ProgressBar percentage={progressPercentage} />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">Filter by Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300/50 dark:border-gray-600/50 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700/80 dark:text-white backdrop-blur-sm"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {isAddingTopic && (
          <form onSubmit={handleAddTopic} className="space-y-2 bg-white/50 dark:bg-gray-700/50 p-3 rounded-lg backdrop-blur-sm animate-fade-in-up">
            <input
              type="text"
              value={newTopicName}
              onChange={(e) => setNewTopicName(e.target.value)}
              placeholder="Enter topic name"
              className="w-full px-2 py-1 text-sm border border-gray-300/50 dark:border-gray-600/50 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700/80 dark:text-white backdrop-blur-sm"
              autoFocus
            />
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter category (optional)"
              className="w-full px-2 py-1 text-sm border border-gray-300/50 dark:border-gray-600/50 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700/80 dark:text-white backdrop-blur-sm"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 px-3 py-1 text-sm bg-blue-500/90 hover:bg-blue-600/90 text-white rounded-md transition-colors backdrop-blur-sm"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setIsAddingTopic(false)}
                className="px-3 py-1 text-sm border border-gray-300/50 dark:border-gray-600/50 rounded-md hover:bg-gray-100/50 dark:hover:bg-gray-600/50 backdrop-blur-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="mt-4 space-y-4">
        {categories.filter(cat => cat !== 'all').map(category => {
          const categoryTopics = filteredTopics.filter(t => t.category === category);
          if (selectedCategory !== 'all' && category !== selectedCategory) return null;
          if (categoryTopics.length === 0) return null;

          return (
            <div key={category} className="space-y-2">
              <div className="flex items-center gap-2 bg-white/30 dark:bg-gray-700/30 p-2 rounded-lg backdrop-blur-sm">
                <FolderOpen className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {category}
                </h4>
              </div>
              {categoryTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors group ml-4 backdrop-blur-sm hover-lift"
                >
                  <button
                    onClick={() => onToggleTopic?.(topic.id)}
                    className="mt-1 text-gray-400 hover:text-blue-500 dark:text-gray-600 dark:hover:text-blue-400"
                  >
                    {topic.completed ? (
                      <CheckSquare className="w-4 h-4" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                  <div>
                    <p className={`text-sm text-gray-900 dark:text-white ${topic.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
                      {topic.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {topic.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
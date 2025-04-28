import { useState, useEffect } from 'react';
import { Clock, Play, Pause, RefreshCw } from 'lucide-react';

interface TimerProps {
  onTimeUp?: () => void;
  timeLimit?: number; // Time limit in seconds
}

export function Timer({ onTimeUp, timeLimit = 1800 }: TimerProps) {
  const [seconds, setSeconds] = useState(timeLimit);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(seconds => {
          const newSeconds = seconds - 1;
          if (newSeconds === 0) {
            setIsActive(false);
            onTimeUp?.();
          }
          return newSeconds;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, onTimeUp]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setSeconds(timeLimit);
    setIsActive(true);
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-blue-500" />
        <span className={`font-mono text-lg font-medium ${
          seconds < 300 ? 'text-red-500' : seconds < 600 ? 'text-yellow-500' : 'text-gray-900 dark:text-white'
        }`}>
          {formatTime(seconds)}
        </span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={toggleTimer}
          className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
          aria-label={isActive ? 'Pause timer' : 'Start timer'}
        >
          {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button
          onClick={resetTimer}
          className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
          aria-label="Reset timer"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
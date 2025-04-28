interface ProgressBarProps {
  percentage: number;
  color?: string;
}

export function ProgressBar({ percentage, color = "blue" }: ProgressBarProps) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
      <div
        className={`bg-${color}-600 h-2.5 rounded-full transition-all duration-500 ease-out`}
        style={{ width: `${percentage}%` }}
      >
        <span className="sr-only">{percentage}% Complete</span>
      </div>
    </div>
  );
}
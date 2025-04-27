import { useState } from "react";
import { ChevronDown } from "lucide-react";

const exams = [
  { id: "jee", name: "JEE", color: "blue" },
  { id: "neet", name: "NEET", color: "green" },
  { id: "upsc", name: "UPSC", color: "purple" },
  { id: "nda", name: "NDA", color: "orange" },
  { id: "cds", name: "CDS", color: "red" },
];

export function ExamDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(exams[0]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors dark:text-white"
      >
        <span className="text-sm font-medium">Select Exam: {selectedExam.name}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
          {exams.map((exam) => (
            <button
              key={exam.id}
              onClick={() => {
                setSelectedExam(exam);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors dark:text-white ${
                selectedExam.id === exam.id ? "bg-gray-50 dark:bg-gray-700" : ""
              }`}
            >
              {exam.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
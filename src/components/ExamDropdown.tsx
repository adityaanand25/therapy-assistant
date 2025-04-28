import { BookOpen } from "lucide-react";

const exams = [
  { id: "jee", name: "JEE", color: "blue", description: "Joint Entrance Examination" },
  { id: "neet", name: "NEET", color: "green", description: "National Eligibility cum Entrance Test" },
  { id: "upsc", name: "UPSC", color: "purple", description: "Union Public Service Commission" },
  { id: "nda", name: "NDA", color: "orange", description: "National Defence Academy" },
  { id: "cds", name: "CDS", color: "red", description: "Combined Defence Services" },
  { id: "gate", name: "GATE", color: "indigo", description: "Graduate Aptitude Test in Engineering" },
];

interface ExamDropdownProps {
  onExamSelect?: (exam: typeof exams[0]) => void;
  selectedExam?: typeof exams[0];
  onMockTestSelect?: (examId: string) => void;
}

export function ExamDropdown({ onExamSelect, selectedExam, onMockTestSelect }: ExamDropdownProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl mx-auto">
      {exams.map((exam) => (
        <div key={exam.id} className="flex flex-col gap-2">
          <button
            onClick={() => onExamSelect?.(exam)}
            className={`p-6 rounded-xl border transition-all duration-300 flex flex-col items-center gap-3 hover:scale-105 
              bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover-lift
              ${selectedExam?.id === exam.id 
                ? "border-2 border-blue-500 dark:border-blue-400 shadow-lg" 
                : "border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300 dark:hover:border-blue-600"}
              ${selectedExam?.id === exam.id 
                ? "bg-gradient-to-br from-blue-50/90 to-indigo-50/90 dark:from-gray-700/90 dark:to-gray-800/90" 
                : "hover:bg-gray-50/90 dark:hover:bg-gray-700/90"}`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-${exam.color}-100/80 dark:bg-${exam.color}-900/80 backdrop-blur-sm`}>
              <BookOpen className={`w-6 h-6 text-${exam.color}-600 dark:text-${exam.color}-400`} />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{exam.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{exam.description}</p>
            </div>
          </button>
          <button
            onClick={() => onMockTestSelect?.(exam.id)}
            className="px-4 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            Take Mock Test
          </button>
        </div>
      ))}
    </div>
  );
}
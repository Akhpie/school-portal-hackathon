import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertCircle,
  ArrowLeftRight,
  BarChart,
  BookOpen,
  Calendar,
  CalendarDays,
  Check,
  CheckCircle,
  Clock,
  ClipboardList,
  Download,
  ExternalLink,
  File,
  FileText,
  Filter,
  GraduationCap,
  RefreshCw,
  Timer,
  Upload,
} from "lucide-react";
import { toast } from "@/components/ui/sonner";

// IndexedDB setup
const initializeDB = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open("SchoolVerseDB", 1);

    request.onerror = (event) => {
      console.error("Error opening IndexedDB:", event);
      reject("Error opening database");
    };

    request.onupgradeneeded = (event) => {
      const db = request.result;

      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains("assignments")) {
        db.createObjectStore("assignments", { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains("completedExams")) {
        db.createObjectStore("completedExams", { keyPath: "examId" });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };
  });
};

// Helper function to access assignment store
const getAssignmentStore = async (mode: IDBTransactionMode = "readonly") => {
  const db = await initializeDB();
  const transaction = db.transaction("assignments", mode);
  return transaction.objectStore("assignments");
};

// Helper function to access completed exams store
const getCompletedExamsStore = async (
  mode: IDBTransactionMode = "readonly"
) => {
  const db = await initializeDB();
  const transaction = db.transaction("completedExams", mode);
  return transaction.objectStore("completedExams");
};

// Helper function to get all items from a store
const getAllItems = <T,>(store: IDBObjectStore): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result as T[]);
    request.onerror = (error) => reject(error);
  });
};

const Assignments = () => {
  const [filter, setFilter] = useState("all");
  const [showExamDetails, setShowExamDetails] = useState(false);
  const [showExamPortal, setShowExamPortal] = useState(false);
  const [currentExam, setCurrentExam] = useState(null);
  const [examAnswers, setExamAnswers] = useState({});
  const [completedExams, setCompletedExams] = useState([]);
  const [examTimeLeft, setExamTimeLeft] = useState(0);
  const [examTimerActive, setExamTimerActive] = useState(false);
  const [showExamResults, setShowExamResults] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [dbInitialized, setDbInitialized] = useState(false);
  const [examInProgress, setExamInProgress] = useState(false);
  const [examTimeRemaining, setExamTimeRemaining] = useState(0);
  const [currentAnswers, setCurrentAnswers] = useState([]);
  const [selectedTab, setSelectedTab] = useState("all");
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);

  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Sample assignment data for initial loading
  const sampleAssignments = [
    {
      id: 1,
      title: "Research Paper: Modern Literature Analysis",
      course: "World Literature",
      dueDate: "2025-04-25T23:59:59",
      status: "in-progress",
      progress: 65,
      priority: "high",
      type: "assignment",
    },
    {
      id: 2,
      title: "Problem Set 3: Differential Equations",
      course: "Advanced Mathematics",
      dueDate: "2025-04-20T23:59:59",
      status: "in-progress",
      progress: 30,
      priority: "medium",
      type: "assignment",
    },
    {
      id: 3,
      title: "Lab Report: Chemical Reactions",
      course: "Chemistry",
      dueDate: "2025-04-18T23:59:59",
      status: "not-started",
      progress: 0,
      priority: "medium",
      type: "assignment",
    },
    {
      id: 4,
      title: "Midterm Examination",
      course: "World History",
      dueDate: "2025-04-22T23:59:59",
      status: "pending",
      type: "exam",
      duration: "60 minutes",
      totalQuestions: 10,
      passingScore: 70,
      description:
        "Comprehensive examination covering chapters 1-5 of the World History textbook, focusing on ancient civilizations, medieval history, and the Renaissance period.",
      instructions:
        "This exam consists of multiple-choice questions. Select the best answer for each question. You may navigate between questions freely. Once you submit, your answers will be final.",
      questions: [
        {
          id: "q1",
          text: "Which ancient civilization built the Great Pyramids of Giza?",
          options: [
            "Roman Empire",
            "Ancient Egypt",
            "Mesopotamia",
            "Indus Valley",
          ],
          correctAnswer: "Ancient Egypt",
        },
        {
          id: "q2",
          text: "The Magna Carta was signed in what year?",
          options: ["1066", "1215", "1492", "1776"],
          correctAnswer: "1215",
        },
        {
          id: "q3",
          text: "Who was the first Emperor of the Roman Empire?",
          options: [
            "Julius Caesar",
            "Marcus Aurelius",
            "Augustus",
            "Constantine",
          ],
          correctAnswer: "Augustus",
        },
        {
          id: "q4",
          text: "The Renaissance period began in which country?",
          options: ["France", "England", "Italy", "Spain"],
          correctAnswer: "Italy",
        },
        {
          id: "q5",
          text: "Which of these was NOT one of the ancient Seven Wonders of the World?",
          options: [
            "The Great Wall of China",
            "The Hanging Gardens of Babylon",
            "The Colossus of Rhodes",
            "The Temple of Artemis",
          ],
          correctAnswer: "The Great Wall of China",
        },
        {
          id: "q6",
          text: "Which empire was ruled by Genghis Khan?",
          options: [
            "Ottoman Empire",
            "Mongol Empire",
            "Byzantine Empire",
            "Persian Empire",
          ],
          correctAnswer: "Mongol Empire",
        },
        {
          id: "q7",
          text: "The Middle Ages in Europe is generally considered to have ended around what year?",
          options: ["1200", "1350", "1450", "1600"],
          correctAnswer: "1450",
        },
        {
          id: "q8",
          text: "Which of the following was a major cause of the Crusades?",
          options: [
            "Religious pilgrimages",
            "Economic expansion",
            "Cultural exchange",
            "Territorial conquest",
          ],
          correctAnswer: "Religious pilgrimages",
        },
        {
          id: "q9",
          text: "Who wrote 'The Prince', a political treatise from the Renaissance period?",
          options: [
            "Leonardo da Vinci",
            "Michelangelo",
            "Niccolò Machiavelli",
            "Galileo Galilei",
          ],
          correctAnswer: "Niccolò Machiavelli",
        },
        {
          id: "q10",
          text: "The Silk Road primarily connected which regions?",
          options: [
            "Europe and Africa",
            "China and the Mediterranean",
            "India and Southeast Asia",
            "Japan and Korea",
          ],
          correctAnswer: "China and the Mediterranean",
        },
      ],
    },
    {
      id: 5,
      title: "Final Examination",
      course: "Physics: Mechanics & Motion",
      dueDate: "2025-04-26T23:59:59",
      status: "pending",
      type: "exam",
      duration: "45 minutes",
      totalQuestions: 10,
      passingScore: 60,
      description:
        "Comprehensive examination covering fundamental physics concepts, including Newton's laws, motion, energy, and momentum conservation.",
      instructions:
        "This exam consists of multiple-choice questions. Each question has only one correct answer. You will have 45 minutes to complete the exam. Calculator usage is permitted.",
      questions: [
        {
          id: "q1",
          text: "What is the SI unit of force?",
          options: ["Watt", "Joule", "Newton", "Pascal"],
          correctAnswer: "Newton",
        },
        {
          id: "q2",
          text: "Which of Newton's laws states that for every action, there is an equal and opposite reaction?",
          options: [
            "First Law",
            "Second Law",
            "Third Law",
            "Law of Conservation of Momentum",
          ],
          correctAnswer: "Third Law",
        },
        {
          id: "q3",
          text: "If a car accelerates from 0 to 60 km/h in 10 seconds, what is its average acceleration?",
          options: ["6 m/s²", "1.67 m/s²", "60 m/s²", "600 m/s²"],
          correctAnswer: "1.67 m/s²",
        },
        {
          id: "q4",
          text: "What is the formula for kinetic energy?",
          options: ["KE = mgh", "KE = Fd", "KE = 0.5mv²", "KE = P/t"],
          correctAnswer: "KE = 0.5mv²",
        },
        {
          id: "q5",
          text: "Which quantity is always conserved in a closed system?",
          options: ["Velocity", "Acceleration", "Momentum", "Speed"],
          correctAnswer: "Momentum",
        },
        {
          id: "q6",
          text: "What happens to the gravitational force between two objects when the distance between them is doubled?",
          options: [
            "It doubles",
            "It halves",
            "It remains the same",
            "It decreases to one-fourth",
          ],
          correctAnswer: "It decreases to one-fourth",
        },
        {
          id: "q7",
          text: "Which of the following is a scalar quantity?",
          options: ["Force", "Velocity", "Temperature", "Momentum"],
          correctAnswer: "Temperature",
        },
        {
          id: "q8",
          text: "What is the momentum of a 2 kg object moving at 3 m/s?",
          options: ["2 kg·m/s", "3 kg·m/s", "6 kg·m/s", "9 kg·m/s"],
          correctAnswer: "6 kg·m/s",
        },
        {
          id: "q9",
          text: "A ball is thrown vertically upward. At the highest point of its trajectory, what is its acceleration?",
          options: [
            "0 m/s²",
            "9.8 m/s² upward",
            "9.8 m/s² downward",
            "Variable",
          ],
          correctAnswer: "9.8 m/s² downward",
        },
        {
          id: "q10",
          text: "Which law of physics does a spinning ice skater demonstrate when they pull in their arms to spin faster?",
          options: [
            "Newton's First Law",
            "Newton's Second Law",
            "Conservation of Linear Momentum",
            "Conservation of Angular Momentum",
          ],
          correctAnswer: "Conservation of Angular Momentum",
        },
      ],
    },
    {
      id: 6,
      title: "Project Presentation: Renewable Energy",
      course: "Environmental Science",
      dueDate: "2025-04-30T23:59:59",
      status: "in-progress",
      progress: 50,
      priority: "high",
      type: "assignment",
    },
  ];

  // Load data from IndexedDB on initial render
  useEffect(() => {
    const loadData = async () => {
      try {
        // Initialize the database
        await initializeDB();
        setDbInitialized(true);

        // Load assignments
        const assignmentStore = await getAssignmentStore();
        const storedAssignments = await getAllItems<any>(assignmentStore);

        // If no assignments are stored, populate with sample data
        if (storedAssignments.length === 0) {
          const writeStore = await getAssignmentStore("readwrite");
          sampleAssignments.forEach((assignment) => {
            writeStore.add(assignment);
          });
          setAssignments(sampleAssignments);
        } else {
          setAssignments(storedAssignments);
        }

        // Load completed exams
        const examStore = await getCompletedExamsStore();
        const storedExams = await getAllItems<any>(examStore);
        setCompletedExams(storedExams);
      } catch (error) {
        console.error("Error loading data from IndexedDB:", error);
        // Fall back to sample data
        setAssignments(sampleAssignments);
      }
    };

    loadData();
  }, []);

  // Function to save completed exam to IndexedDB
  const saveCompletedExam = async (examResult) => {
    if (!dbInitialized) return;

    try {
      const store = await getCompletedExamsStore("readwrite");
      store.put(examResult);
    } catch (error) {
      console.error("Error saving completed exam:", error);
    }
  };

  // Filter assignments based on selected tab
  const filteredItems = () => {
    // Get only assignments (not exams)
    const assignmentsOnly = assignments.filter(
      (item) => item.type === "assignment"
    );

    // Get only exams
    const examsOnly = assignments.filter((item) => item.type === "exam");

    switch (filter) {
      case "assignments":
        return assignmentsOnly;
      case "exams":
        return examsOnly;
      case "completed":
        return completedExams.map((exam) => ({
          ...exam,
          type: "completed-exam",
          status: "completed",
        }));
      case "all":
      default:
        return assignments;
    }
  };

  // Calculate due date formatting
  const formatDueDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: "Past due", className: "text-red-500" };
    } else if (diffDays === 0) {
      return { text: "Due today", className: "text-amber-500" };
    } else if (diffDays === 1) {
      return { text: "Due tomorrow", className: "text-amber-500" };
    } else if (diffDays < 7) {
      return { text: `Due in ${diffDays} days`, className: "text-amber-500" };
    } else {
      return {
        text: `Due ${date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })}`,
        className: "text-muted-foreground",
      };
    }
  };

  // Get status styling
  const getStatusStyles = (status) => {
    switch (status) {
      case "completed":
        return {
          icon: CheckCircle,
          className:
            "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
          text: "Completed",
        };
      case "in-progress":
        return {
          icon: Clock,
          className:
            "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
          text: "In Progress",
        };
      case "not-started":
        return {
          icon: AlertCircle,
          className:
            "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
          text: "Not Started",
        };
      case "pending":
        return {
          icon: Timer,
          className:
            "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
          text: "Ready to Take",
        };
      default:
        return {
          icon: FileText,
          className:
            "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
          text: "Unknown",
        };
    }
  };

  // Get priority styling
  const getPriorityStyles = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-amber-500";
      case "low":
        return "text-green-500";
      default:
        return "text-muted-foreground";
    }
  };

  // Function to open exam details
  const handleOpenExamDetails = (exam) => {
    setCurrentExam(exam);
    setShowExamDetails(true);
  };

  // Function to start exam
  const handleStartExam = () => {
    setExamInProgress(true);
    setExamTimeRemaining(currentExam?.duration * 60 || 0);
    setCurrentAnswers(
      currentExam?.questions.map((q) => ({ questionId: q.id, answer: null })) ||
        []
    );
    setSelectedTab("exams"); // Ensure we're on the exams tab
    setShowExamDetails(false); // Close the details modal
    setShowExamPortal(true); // Open the exam portal
  };

  // Function to handle answer selection
  const handleAnswerSelect = (questionId, value) => {
    setExamAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // Function to submit exam
  const handleSubmitExam = () => {
    // Calculate score
    const examQuestions = currentExam?.questions || [];
    let correctAnswers = 0;

    examQuestions.forEach((question) => {
      if (examAnswers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    if (!currentExam) return;

    const score = (correctAnswers / examQuestions.length) * 100;
    const examResult = {
      examId: currentExam.id,
      title: currentExam.title,
      course: currentExam.course,
      completedDate: new Date().toISOString(),
      score: score,
      correctAnswers,
      totalQuestions: examQuestions.length,
    };

    // Add to completed exams state
    setCompletedExams((prev) => [examResult, ...prev]);

    // Save to IndexedDB
    saveCompletedExam(examResult);

    setShowExamPortal(false);
    setExamTimerActive(false);

    // Show success message
    toast.success("Exam submitted successfully", {
      description: `You scored ${score.toFixed(1)}% (${correctAnswers}/${
        examQuestions.length
      } correct)`,
    });

    // Show results
    setTimeout(() => {
      setShowExamResults(true);
    }, 500);
  };

  // Handle exam timer
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (examTimerActive && examTimeLeft > 0) {
      interval = setInterval(() => {
        setExamTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (examTimeLeft <= 0) {
      handleSubmitExam();
    }

    return () => clearInterval(interval);
  }, [examTimerActive, examTimeLeft]);

  // Handle exam exit with confirmation
  const handleExamExit = () => {
    setShowExitConfirmation(true);
  };

  const confirmExamExit = () => {
    setShowExitConfirmation(false);
    setShowExamPortal(false);
    setExamInProgress(false);
    toast.error("Exam Exited", {
      description: "Your progress has not been saved",
    });
  };

  const cancelExamExit = () => {
    setShowExitConfirmation(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold gradient-text">
              Assignments & Exams
            </h1>
            <p className="text-muted-foreground">
              Manage your course assignments and take exams
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
            <Button size="sm" variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
            <Button size="sm" className="gap-2">
              <Upload className="h-4 w-4" />
              <span>Submit Work</span>
            </Button>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-300">
                Total Assignments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">
                  {assignments.filter((a) => a.type === "assignment").length}
                </span>
                <FileText className="h-8 w-8 text-blue-500 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-600 dark:text-purple-300">
                Upcoming Exams
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">
                  {assignments.filter((a) => a.type === "exam").length}
                </span>
                <ClipboardList className="h-8 w-8 text-purple-500 dark:text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600 dark:text-green-300">
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">
                  {completedExams.length}
                </span>
                <CheckCircle className="h-8 w-8 text-green-500 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-amber-200 dark:border-amber-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-amber-600 dark:text-amber-300">
                Upcoming Due
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">
                  {
                    assignments.filter((a) => {
                      const dueDate = new Date(a.dueDate);
                      const now = new Date();
                      const diffDays = Math.ceil(
                        (dueDate.getTime() - now.getTime()) /
                          (1000 * 60 * 60 * 24)
                      );
                      return diffDays >= 0 && diffDays <= 7;
                    }).length
                  }
                </span>
                <CalendarDays className="h-8 w-8 text-amber-500 dark:text-amber-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" onValueChange={setFilter}>
          <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-flex">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="exams">Exams</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <div className="grid gap-4">
              {filteredItems().map((item) => {
                const dueDate = item.dueDate
                  ? formatDueDate(item.dueDate)
                  : { text: "N/A", className: "" };
                const status = getStatusStyles(item.status);
                const StatusIcon = status.icon;

                if (item.type === "exam") {
                  // Render Exam Card
                  return (
                    <Card
                      key={item.id}
                      className="overflow-hidden border-l-4 border-l-purple-500"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-start gap-2">
                            <GraduationCap className="h-5 w-5 text-purple-500 mt-1" />
                            <div>
                              <CardTitle className="text-lg font-semibold">
                                {item.title}
                              </CardTitle>
                              <CardDescription>{item.course}</CardDescription>
                            </div>
                          </div>
                          <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 hover:bg-purple-200">
                            Exam
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                          <div className="flex flex-wrap items-center gap-3">
                            <div
                              className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${status.className}`}
                            >
                              <StatusIcon className="h-3.5 w-3.5" />
                              <span>{status.text}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                              <CalendarDays className="h-4 w-4 text-muted-foreground" />
                              <span className={dueDate.className}>
                                {dueDate.text}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                              <Timer className="h-4 w-4 text-muted-foreground" />
                              <span>{item.duration}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                              <ClipboardList className="h-4 w-4 text-muted-foreground" />
                              <span>{item.totalQuestions} Questions</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t pt-3 flex justify-between flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 text-xs"
                          onClick={() => handleOpenExamDetails(item)}
                        >
                          <span>View Details</span>
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          className="gap-1 bg-purple-600 hover:bg-purple-700"
                          onClick={() => {
                            setCurrentExam(item);
                            setShowExamDetails(true);
                          }}
                        >
                          <span>Take Exam</span>
                          <ArrowLeftRight className="h-3 w-3" />
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                } else if (item.type === "completed-exam") {
                  // Render Completed Exam Card
                  return (
                    <Card
                      key={item.examId}
                      className="overflow-hidden border-l-4 border-l-green-500"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-start gap-2">
                            <GraduationCap className="h-5 w-5 text-green-500 mt-1" />
                            <div>
                              <CardTitle className="text-lg font-semibold">
                                {item.title}
                              </CardTitle>
                              <CardDescription>{item.course}</CardDescription>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 hover:bg-green-200">
                            Completed
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                          <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-1 text-sm">
                              <CalendarDays className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                Completed{" "}
                                {new Date(
                                  item.completedDate
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                              <BarChart className="h-4 w-4 text-muted-foreground" />
                              <span
                                className={
                                  item.score >= 70
                                    ? "text-green-600"
                                    : "text-amber-600"
                                }
                              >
                                Score: {Math.round(item.score)}%
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                              <Check className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {item.correctAnswers}/{item.totalQuestions}{" "}
                                Correct
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t pt-3 flex justify-between flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 text-xs"
                          onClick={() => {
                            setShowExamResults(true);
                            setCurrentExam(
                              assignments.find((a) => a.id === item.examId)
                            );
                          }}
                        >
                          <span>View Results</span>
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          className="gap-1 bg-green-600 hover:bg-green-700"
                          onClick={() => {
                            const exam = assignments.find(
                              (a) => a.id === item.examId
                            );
                            if (exam) {
                              setCurrentExam(exam);
                              setShowExamDetails(true);
                              toast.success("Retaking exam", {
                                description:
                                  "You can improve your previous score of " +
                                  Math.round(item.score) +
                                  "%",
                              });
                            }
                          }}
                        >
                          <span>Retake Exam</span>
                          <RefreshCw className="h-3 w-3" />
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                } else {
                  // Render Assignment Card
                  return (
                    <Card
                      key={item.id}
                      className="overflow-hidden border-l-4 border-l-blue-500"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-start gap-2">
                            <FileText className="h-5 w-5 text-blue-500 mt-1" />
                            <div>
                              <CardTitle className="text-lg font-semibold">
                                {item.title}
                              </CardTitle>
                              <CardDescription>{item.course}</CardDescription>
                            </div>
                          </div>
                          {item.priority && (
                            <span className={getPriorityStyles(item.priority)}>
                              {item.priority.charAt(0).toUpperCase() +
                                item.priority.slice(1)}{" "}
                              Priority
                            </span>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                          <div className="flex flex-wrap items-center gap-3">
                            <div
                              className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${status.className}`}
                            >
                              <StatusIcon className="h-3.5 w-3.5" />
                              <span>{status.text}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                              <CalendarDays className="h-4 w-4 text-muted-foreground" />
                              <span className={dueDate.className}>
                                {dueDate.text}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1 text-xs"
                          >
                            <span>View Details</span>
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Progress</span>
                            <span>{item.progress}%</span>
                          </div>
                          <Progress value={item.progress} className="h-1.5" />
                        </div>
                      </CardContent>
                    </Card>
                  );
                }
              })}

              {filteredItems().length === 0 && (
                <div className="text-center p-8">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                  <h3 className="mt-4 text-lg font-medium">No items found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {filter === "completed"
                      ? "You haven't completed any exams yet."
                      : filter === "exams"
                      ? "You don't have any exams."
                      : filter === "assignments"
                      ? "You don't have any assignments."
                      : "You don't have any assignments or exams."}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="assignments" className="mt-4">
            <div className="grid gap-4">
              {filteredItems().map((item) => {
                const dueDate = item.dueDate
                  ? formatDueDate(item.dueDate)
                  : { text: "N/A", className: "" };
                const status = getStatusStyles(item.status);
                const StatusIcon = status.icon;

                // Render Assignment Card
                return (
                  <Card
                    key={item.id}
                    className="overflow-hidden border-l-4 border-l-blue-500"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-2">
                          <FileText className="h-5 w-5 text-blue-500 mt-1" />
                          <div>
                            <CardTitle className="text-lg font-semibold">
                              {item.title}
                            </CardTitle>
                            <CardDescription>{item.course}</CardDescription>
                          </div>
                        </div>
                        {item.priority && (
                          <span className={getPriorityStyles(item.priority)}>
                            {item.priority.charAt(0).toUpperCase() +
                              item.priority.slice(1)}{" "}
                            Priority
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <div
                            className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${status.className}`}
                          >
                            <StatusIcon className="h-3.5 w-3.5" />
                            <span>{status.text}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                            <span className={dueDate.className}>
                              {dueDate.text}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1 text-xs"
                        >
                          <span>View Details</span>
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Progress</span>
                          <span>{item.progress}%</span>
                        </div>
                        <Progress value={item.progress} className="h-1.5" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {filteredItems().length === 0 && (
                <div className="text-center p-8">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                  <h3 className="mt-4 text-lg font-medium">
                    No assignments found
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    You don't have any assignments yet.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="exams" className="mt-4">
            <div className="grid gap-4">
              {filteredItems().map((item) => {
                const dueDate = item.dueDate
                  ? formatDueDate(item.dueDate)
                  : { text: "N/A", className: "" };
                const status = getStatusStyles(item.status);
                const StatusIcon = status.icon;

                // Render Exam Card
                return (
                  <Card
                    key={item.id}
                    className="overflow-hidden border-l-4 border-l-purple-500"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-2">
                          <GraduationCap className="h-5 w-5 text-purple-500 mt-1" />
                          <div>
                            <CardTitle className="text-lg font-semibold">
                              {item.title}
                            </CardTitle>
                            <CardDescription>{item.course}</CardDescription>
                          </div>
                        </div>
                        <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 hover:bg-purple-200">
                          Exam
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <div
                            className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${status.className}`}
                          >
                            <StatusIcon className="h-3.5 w-3.5" />
                            <span>{status.text}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                            <span className={dueDate.className}>
                              {dueDate.text}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Timer className="h-4 w-4 text-muted-foreground" />
                            <span>{item.duration}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <ClipboardList className="h-4 w-4 text-muted-foreground" />
                            <span>{item.totalQuestions} Questions</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-3 flex justify-between flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 text-xs"
                        onClick={() => handleOpenExamDetails(item)}
                      >
                        <span>View Details</span>
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        className="gap-1 bg-purple-600 hover:bg-purple-700"
                        onClick={() => {
                          setCurrentExam(item);
                          setShowExamDetails(true);
                        }}
                      >
                        <span>Take Exam</span>
                        <ArrowLeftRight className="h-3 w-3" />
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}

              {filteredItems().length === 0 && (
                <div className="text-center p-8">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                  <h3 className="mt-4 text-lg font-medium">No exams found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    You don't have any exams yet.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-4">
            <div className="grid gap-4">
              {filteredItems().map((item) => {
                // Render Completed Exam Card
                return (
                  <Card
                    key={item.examId}
                    className="overflow-hidden border-l-4 border-l-green-500"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-2">
                          <GraduationCap className="h-5 w-5 text-green-500 mt-1" />
                          <div>
                            <CardTitle className="text-lg font-semibold">
                              {item.title}
                            </CardTitle>
                            <CardDescription>{item.course}</CardDescription>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 hover:bg-green-200">
                          Completed
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex items-center gap-1 text-sm">
                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              Completed{" "}
                              {new Date(item.completedDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <BarChart className="h-4 w-4 text-muted-foreground" />
                            <span
                              className={
                                item.score >= 70
                                  ? "text-green-600"
                                  : "text-amber-600"
                              }
                            >
                              Score: {Math.round(item.score)}%
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Check className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {item.correctAnswers}/{item.totalQuestions}{" "}
                              Correct
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-3 flex justify-between flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 text-xs"
                        onClick={() => {
                          setShowExamResults(true);
                          setCurrentExam(
                            assignments.find((a) => a.id === item.examId)
                          );
                        }}
                      >
                        <span>View Results</span>
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        className="gap-1 bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          const exam = assignments.find(
                            (a) => a.id === item.examId
                          );
                          if (exam) {
                            setCurrentExam(exam);
                            setShowExamDetails(true);
                            toast.success("Retaking exam", {
                              description:
                                "You can improve your previous score of " +
                                Math.round(item.score) +
                                "%",
                            });
                          }
                        }}
                      >
                        <span>Retake Exam</span>
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}

              {filteredItems().length === 0 && (
                <div className="text-center p-8">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                  <h3 className="mt-4 text-lg font-medium">
                    No completed exams
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    You haven't completed any exams yet.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Exam Details Dialog */}
      <Dialog open={showExamDetails} onOpenChange={setShowExamDetails}>
        {currentExam && (
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-purple-500" />
                {currentExam.title}
              </DialogTitle>
              <DialogDescription>{currentExam.course}</DialogDescription>
            </DialogHeader>

            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-6 py-4 pr-4">
                <div className="space-y-2">
                  <h3 className="font-medium text-lg">Exam Details</h3>
                  <p className="text-sm text-muted-foreground">
                    {currentExam.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Timer className="h-4 w-4 text-muted-foreground" />
                      <h4 className="font-medium">Duration</h4>
                    </div>
                    <p className="text-sm">{currentExam.duration}</p>
                  </Card>

                  <Card className="p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <ClipboardList className="h-4 w-4 text-muted-foreground" />
                      <h4 className="font-medium">Questions</h4>
                    </div>
                    <p className="text-sm">
                      {currentExam.totalQuestions} multiple choice
                    </p>
                  </Card>

                  <Card className="p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <BarChart className="h-4 w-4 text-muted-foreground" />
                      <h4 className="font-medium">Passing Score</h4>
                    </div>
                    <p className="text-sm">{currentExam.passingScore}%</p>
                  </Card>

                  <Card className="p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <RefreshCw className="h-4 w-4 text-muted-foreground" />
                      <h4 className="font-medium">Attempts</h4>
                    </div>
                    <p className="text-sm">Unlimited</p>
                  </Card>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-lg">Instructions</h3>
                  <div className="bg-muted p-4 rounded-md text-sm">
                    <p>{currentExam.instructions}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-lg">Before You Begin</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <span>
                        Ensure you have a stable internet connection for the
                        duration of the exam.
                      </span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <span>
                        Have any permitted materials or notes ready before
                        starting.
                      </span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <span>
                        Once started, the exam timer will continue to run even
                        if you close the browser.
                      </span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <span>
                        You can review your answers before final submission.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </ScrollArea>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => setShowExamDetails(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleStartExam}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Start Exam
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Exam Portal */}
      <Dialog
        open={showExamPortal}
        onOpenChange={(open) => {
          if (!open && examInProgress) {
            // Prevent immediate closing with back button/escape key
            handleExamExit();
            return false;
          }
          return true;
        }}
      >
        {examInProgress && (
          <DialogContent className="max-w-4xl p-0 h-[90vh] flex flex-col overflow-hidden">
            <DialogHeader className="p-6 border-b">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <DialogTitle className="text-xl">
                    {currentExam?.title}
                  </DialogTitle>
                  <DialogDescription>
                    {currentExam?.course} • {currentExam?.questions.length}{" "}
                    Questions
                  </DialogDescription>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>{formatTime(examTimeRemaining)}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExamExit}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    Exit Exam
                  </Button>
                </div>
              </div>
            </DialogHeader>

            {/* Exam Content */}
            <div
              style={{ height: "calc(90vh - 160px)", overflow: "auto" }}
              className="p-6"
            >
              <div className="space-y-8">
                {currentExam.questions.map((question, index) => (
                  <div key={question.id} className="space-y-4">
                    <div className="flex items-start gap-2">
                      <div className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <h3 className="text-lg font-medium">{question.text}</h3>
                    </div>

                    <RadioGroup
                      value={examAnswers[question.id] || ""}
                      onValueChange={(value) =>
                        handleAnswerSelect(question.id, value)
                      }
                      className="ml-10 space-y-2"
                    >
                      {question.options.map((option) => (
                        <div
                          key={option}
                          className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted"
                        >
                          <RadioGroupItem
                            value={option}
                            id={`${question.id}-${option}`}
                          />
                          <Label
                            htmlFor={`${question.id}-${option}`}
                            className="flex-grow cursor-pointer"
                          >
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}
              </div>
            </div>

            {/* Exam Footer */}
            <div className="bg-slate-100 dark:bg-slate-900 p-4 border-t mt-auto">
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  {Object.keys(examAnswers).length} of{" "}
                  {currentExam.questions.length} questions answered
                </div>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to exit the exam? Your progress will be lost."
                        )
                      ) {
                        setShowExamPortal(false);
                        setExamTimerActive(false);
                      }
                    }}
                  >
                    Exit Exam
                  </Button>
                  <Button
                    onClick={handleSubmitExam}
                    disabled={
                      Object.keys(examAnswers).length <
                      currentExam.questions.length
                    }
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Submit Exam
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Exam Results Dialog */}
      <Dialog open={showExamResults} onOpenChange={setShowExamResults}>
        {currentExam && (
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <BarChart className="h-5 w-5 text-purple-500" />
                Exam Results: {currentExam.title}
              </DialogTitle>
              <DialogDescription>{currentExam.course}</DialogDescription>
            </DialogHeader>

            {completedExams.find((exam) => exam.examId === currentExam.id) && (
              <div className="space-y-6 py-4">
                {(() => {
                  const examResult = completedExams.find(
                    (exam) => exam.examId === currentExam.id
                  );
                  const score = examResult.score;
                  const isPassing = score >= currentExam.passingScore;

                  return (
                    <>
                      <div
                        className={`p-4 rounded-md ${
                          isPassing
                            ? "bg-green-100 dark:bg-green-900/30"
                            : "bg-amber-100 dark:bg-amber-900/30"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {isPassing ? (
                            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                          ) : (
                            <AlertCircle className="h-10 w-10 text-amber-600 dark:text-amber-400" />
                          )}
                          <div>
                            <h3
                              className={`text-lg font-bold ${
                                isPassing
                                  ? "text-green-700 dark:text-green-300"
                                  : "text-amber-700 dark:text-amber-300"
                              }`}
                            >
                              {isPassing ? "Passed!" : "Not Passed"}
                            </h3>
                            <p className="text-sm">
                              {isPassing
                                ? `Congratulations! You've successfully passed this exam.`
                                : `You didn't meet the passing score. Consider reviewing the material and trying again.`}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-medium">Performance Summary</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <Card className="p-4 bg-muted">
                            <div className="text-sm text-muted-foreground">
                              Your Score
                            </div>
                            <div className="text-2xl font-bold">
                              {Math.round(score)}%
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Passing: {currentExam.passingScore}%
                            </div>
                          </Card>

                          <Card className="p-4 bg-muted">
                            <div className="text-sm text-muted-foreground">
                              Correct Answers
                            </div>
                            <div className="text-2xl font-bold">
                              {examResult.correctAnswers}/
                              {examResult.totalQuestions}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {Math.round(
                                (examResult.correctAnswers /
                                  examResult.totalQuestions) *
                                  100
                              )}
                              % accuracy
                            </div>
                          </Card>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowExamResults(false)}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  setShowExamResults(false);
                  setTimeout(() => {
                    setShowExamDetails(true);
                  }, 300);
                }}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Retake Exam
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Exit Confirmation Dialog */}
      <Dialog
        open={showExitConfirmation}
        onOpenChange={setShowExitConfirmation}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Exit Exam?</DialogTitle>
            <DialogDescription>
              Are you sure you want to exit? Your progress will not be saved.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 mt-4">
            <Button
              variant="outline"
              onClick={cancelExamExit}
              className="flex-1"
            >
              Continue Exam
            </Button>
            <Button
              variant="destructive"
              onClick={confirmExamExit}
              className="flex-1"
            >
              Exit Exam
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Assignments;

import { Link } from "react-router-dom";
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useApp } from "@/contexts/AppContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Calendar,
  Bell,
  FileCheck,
  AlertCircle,
  GraduationCap,
  BarChart2,
  ArrowRight,
  Clock,
  Check,
  XCircle,
  Award,
  Users,
  BookOpenCheck,
  Menu,
  LucideIcon,
  ChevronRight,
  Sparkles,
  Activity,
  MoreHorizontal,
  Star,
  PlusCircle,
  Bookmark,
  Zap,
  ChevronsUp,
  Layers,
  Briefcase,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const { currentUser } = useApp();

  // Modal states
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);
  const [assignmentsModalOpen, setAssignmentsModalOpen] = useState(false);
  const [gpaModalOpen, setGpaModalOpen] = useState(false);
  const [progressModalOpen, setProgressModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  if (!currentUser) return null;

  // Mock data for modals
  const attendanceData = [
    { date: "2025-04-01", status: "Present", class: "Mathematics" },
    { date: "2025-04-02", status: "Present", class: "Physics" },
    { date: "2025-04-03", status: "Present", class: "Literature" },
    { date: "2025-04-04", status: "Absent", class: "Chemistry" },
    { date: "2025-04-07", status: "Present", class: "Mathematics" },
    { date: "2025-04-08", status: "Present", class: "Physics" },
    { date: "2025-04-09", status: "Present", class: "Literature" },
    { date: "2025-04-10", status: "Present", class: "Chemistry" },
    { date: "2025-04-11", status: "Present", class: "Mathematics" },
  ];

  const recentAssignments = [
    {
      title: "Physics Report: Wave Mechanics",
      dueDate: "2025-04-12",
      status: "Completed",
      grade: "94%",
    },
    {
      title: "Literature Essay: Modern Poetry",
      dueDate: "2025-04-10",
      status: "Completed",
      grade: "88%",
    },
    {
      title: "Math Problem Set: Calculus",
      dueDate: "2025-04-15",
      status: "In Progress",
      grade: "-",
    },
    {
      title: "Chemistry Lab: Acid-Base Reactions",
      dueDate: "2025-04-20",
      status: "Not Started",
      grade: "-",
    },
    {
      title: "History Research: Renaissance",
      dueDate: "2025-04-08",
      status: "Completed",
      grade: "96%",
    },
  ];

  const courseGrades = [
    { course: "Advanced Mathematics", grade: "A", gpa: 4.0, trend: "up" },
    { course: "Physics", grade: "A-", gpa: 3.7, trend: "stable" },
    { course: "World Literature", grade: "B+", gpa: 3.5, trend: "up" },
    { course: "Chemistry", grade: "A", gpa: 4.0, trend: "stable" },
    { course: "Computer Science", grade: "A+", gpa: 4.0, trend: "up" },
    { course: "Physical Education", grade: "A", gpa: 4.0, trend: "stable" },
  ];

  const coursesProgress = [
    {
      course: "Advanced Mathematics",
      progress: 85,
      materials: 24,
      completed: 19,
    },
    { course: "Physics", progress: 72, materials: 32, completed: 23 },
    { course: "World Literature", progress: 65, materials: 18, completed: 12 },
    { course: "Chemistry", progress: 90, materials: 28, completed: 25 },
    { course: "Computer Science", progress: 78, materials: 35, completed: 27 },
    {
      course: "Physical Education",
      progress: 95,
      materials: 15,
      completed: 14,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Hero Section with Stats Tabs */}
        <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-background rounded-xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                  Welcome back, {currentUser.name}
                </h1>
                <div className="hidden md:flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              </div>
              <p className="text-muted-foreground">
                Your educational journey continues today
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className="px-3 py-1.5 flex items-center gap-2 text-sm"
              >
                <Clock className="h-3.5 w-3.5 text-primary" />
                <span>
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </Badge>
              <Badge
                variant="outline"
                className="px-3 py-1.5 flex items-center gap-2 text-sm"
              >
                <GraduationCap className="h-3.5 w-3.5 text-primary" />
                <span>Spring 2025</span>
              </Badge>
            </div>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="bg-background rounded-lg p-1 shadow-sm"
          >
            <TabsList className="grid grid-cols-4 bg-transparent p-0">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-primary/15 data-[state=active]:text-primary rounded-md"
              >
                <Activity className="h-4 w-4 mr-2" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger
                value="courses"
                className="data-[state=active]:bg-primary/15 data-[state=active]:text-primary rounded-md"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                <span>Courses</span>
              </TabsTrigger>
              <TabsTrigger
                value="upcoming"
                className="data-[state=active]:bg-primary/15 data-[state=active]:text-primary rounded-md"
              >
                <Calendar className="h-4 w-4 mr-2" />
                <span>Schedule</span>
              </TabsTrigger>
              <TabsTrigger
                value="performance"
                className="data-[state=active]:bg-primary/15 data-[state=active]:text-primary rounded-md"
              >
                <BarChart2 className="h-4 w-4 mr-2" />
                <span>Performance</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card
                  className="overflow-hidden hover:shadow-md transition-all cursor-pointer border-t-4 border-blue-500 group"
                  onClick={() => setAttendanceModalOpen(true)}
                >
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Attendance
                    </CardTitle>
                    <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                      <BookOpen className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">98%</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      22 / 23 days this month
                    </p>
                    <Progress
                      value={98}
                      className="h-1.5 mt-3 bg-blue-100 dark:bg-blue-900/20"
                    >
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: "98%" }}
                      />
                    </Progress>
                  </CardContent>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </Card>

                <Card
                  className="overflow-hidden hover:shadow-md transition-all cursor-pointer border-t-4 border-green-500 group"
                  onClick={() => setAssignmentsModalOpen(true)}
                >
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Assignments
                    </CardTitle>
                    <div className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                      <FileCheck className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">85%</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      17 / 20 completed
                    </p>
                    <Progress
                      value={85}
                      className="h-1.5 mt-3 bg-green-100 dark:bg-green-900/20"
                    >
                      <div
                        className="h-full bg-green-500"
                        style={{ width: "85%" }}
                      />
                    </Progress>
                  </CardContent>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </Card>

                <Card
                  className="overflow-hidden hover:shadow-md transition-all cursor-pointer border-t-4 border-amber-500 group"
                  onClick={() => setGpaModalOpen(true)}
                >
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">GPA</CardTitle>
                    <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                      <Award className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3.8</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Current semester
                    </p>
                    <Progress
                      value={95}
                      className="h-1.5 mt-3 bg-amber-100 dark:bg-amber-900/20"
                    >
                      <div
                        className="h-full bg-amber-500"
                        style={{ width: "95%" }}
                      />
                    </Progress>
                  </CardContent>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </Card>

                <Card
                  className="overflow-hidden hover:shadow-md transition-all cursor-pointer border-t-4 border-purple-500 group"
                  onClick={() => setProgressModalOpen(true)}
                >
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Course Progress
                    </CardTitle>
                    <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                      <Layers className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">76%</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Across all courses
                    </p>
                    <Progress
                      value={76}
                      className="h-1.5 mt-3 bg-purple-100 dark:bg-purple-900/20"
                    >
                      <div
                        className="h-full bg-purple-500"
                        style={{ width: "76%" }}
                      />
                    </Progress>
                  </CardContent>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </Card>
              </div>

              {/* Quick Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {[
                  {
                    title: "Classes Today",
                    value: "3",
                    icon: BookOpenCheck,
                    color: "text-blue-500 bg-blue-50 dark:bg-blue-900/20",
                  },
                  {
                    title: "Due This Week",
                    value: "5",
                    icon: AlertCircle,
                    color: "text-orange-500 bg-orange-50 dark:bg-orange-900/20",
                  },
                  {
                    title: "Study Streak",
                    value: "12 days",
                    icon: Zap,
                    color: "text-amber-500 bg-amber-50 dark:bg-amber-900/20",
                  },
                  {
                    title: "Overall Rank",
                    value: "#12",
                    icon: ChevronsUp,
                    color: "text-green-500 bg-green-50 dark:bg-green-900/20",
                  },
                ].map((stat, i) => (
                  <Card key={i} className="hover:shadow-md transition-all">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {stat.title}
                        </p>
                        <p className="text-xl font-semibold mt-1">
                          {stat.value}
                        </p>
                      </div>
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center ${stat.color}`}
                      >
                        <stat.icon className="h-5 w-5" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="courses" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>My Courses</CardTitle>
                  <CardDescription>All your enrolled courses</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {coursesProgress.map((course, i) => (
                    <div
                      key={i}
                      className="flex flex-col md:flex-row md:items-center justify-between gap-2 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors border"
                    >
                      <div>
                        <div className="font-medium">{course.course}</div>
                        <div className="text-xs text-muted-foreground">
                          {course.completed} of {course.materials} materials
                          completed
                        </div>
                      </div>
                      <div className="flex items-center md:gap-6">
                        <div className="w-24 hidden md:block">
                          <Progress value={course.progress} className="h-2">
                            <div
                              className="h-full bg-primary"
                              style={{ width: `${course.progress}%` }}
                            />
                          </Progress>
                          <div className="text-xs text-right mt-1">
                            {course.progress}%
                          </div>
                        </div>
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                          View
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Link to="/courses" className="w-full">
                    <Button className="w-full">Go to Courses</Button>
                  </Link>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="upcoming" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Schedule</CardTitle>
                  <CardDescription>
                    Your classes and events for today
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      time: "08:30 AM",
                      title: "Advanced Mathematics",
                      location: "Room 302",
                      status: "Upcoming",
                      color:
                        "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
                    },
                    {
                      time: "10:15 AM",
                      title: "Physics Lab",
                      location: "Science Building",
                      status: "Upcoming",
                      color:
                        "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
                    },
                    {
                      time: "12:00 PM",
                      title: "Lunch Break",
                      location: "Cafeteria",
                      status: "Break",
                      color:
                        "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
                    },
                    {
                      time: "01:30 PM",
                      title: "World Literature",
                      location: "Room 201",
                      status: "Upcoming",
                      color:
                        "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
                    },
                    {
                      time: "03:00 PM",
                      title: "Computer Science",
                      location: "Room 105",
                      status: "Upcoming",
                      color:
                        "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-start rounded-lg p-3 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors border"
                    >
                      <div className="flex gap-3">
                        <div className="text-sm font-medium text-primary tabular-nums min-w-[75px]">
                          {item.time}
                        </div>
                        <div>
                          <div className="font-medium">{item.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {item.location}
                          </div>
                        </div>
                      </div>
                      <div
                        className={`text-xs px-2 py-1 rounded-full ${item.color}`}
                      >
                        {item.status}
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Link to="/schedule" className="w-full">
                    <Button variant="outline" className="w-full">
                      View Full Schedule
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Academic Performance</CardTitle>
                  <CardDescription>Your grades and GPA</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl mb-6">
                    <div className="space-y-1">
                      <div className="text-lg font-medium">
                        Current GPA: 3.8
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Spring Semester 2025
                      </div>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-800 shadow-md flex items-center justify-center border-4 border-amber-200 dark:border-amber-600">
                      <span className="text-lg font-bold text-amber-600">
                        A-
                      </span>
                    </div>
                  </div>

                  <h3 className="text-sm font-medium mb-2">Course Grades</h3>
                  <div className="space-y-3">
                    {courseGrades.slice(0, 4).map((course, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-lg border"
                      >
                        <div className="flex-1">
                          <div className="font-medium">{course.course}</div>
                          <div className="text-xs text-muted-foreground">
                            GPA: {course.gpa.toFixed(1)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold ${
                              course.grade.startsWith("A")
                                ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                                : course.grade.startsWith("B")
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                                : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                            }`}
                          >
                            {course.grade}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setGpaModalOpen(true)}
                  >
                    View Full Performance Report
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Upcoming & Notifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-none shadow-md bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-800 overflow-hidden">
            <CardHeader className="pb-3 bg-white/80 dark:bg-slate-950/50 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Today's Schedule
                </CardTitle>
                <Badge
                  variant="outline"
                  className="px-2 py-1 flex items-center gap-2"
                >
                  <Clock className="h-3 w-3" />
                  <span>4 Classes</span>
                </Badge>
              </div>
              <CardDescription>
                Classes and activities for today
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  time: "08:30 AM",
                  title: "Advanced Mathematics",
                  location: "Room 302",
                  status: "Upcoming",
                  color:
                    "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
                },
                {
                  time: "10:15 AM",
                  title: "Physics Lab",
                  location: "Science Building",
                  status: "Upcoming",
                  color:
                    "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
                },
                {
                  time: "12:00 PM",
                  title: "Lunch Break",
                  location: "Cafeteria",
                  status: "Break",
                  color:
                    "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
                },
                {
                  time: "01:30 PM",
                  title: "World Literature",
                  location: "Room 201",
                  status: "Upcoming",
                  color:
                    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-start rounded-lg p-3 hover:bg-white/60 dark:hover:bg-slate-900/50 transition-colors"
                >
                  <div className="flex gap-3">
                    <div className="text-sm font-medium text-primary tabular-nums min-w-[75px]">
                      {item.time}
                    </div>
                    <div>
                      <div className="font-medium">{item.title}</div>
                      <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {item.location}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`text-xs px-2 py-1 rounded-full ${item.color}`}
                  >
                    {item.status}
                  </div>
                </div>
              ))}
              <div className="pt-2 text-center">
                <Link to="/schedule">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 text-xs bg-white/80 dark:bg-slate-900/50 w-full"
                  >
                    <span>View Full Schedule</span>
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Recent Notifications
                </CardTitle>
                <Badge
                  variant="outline"
                  className="px-2 py-1 flex items-center gap-1"
                >
                  <span>4 New</span>
                </Badge>
              </div>
              <CardDescription>Updates and announcements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  title: "Assignment Deadline Extended",
                  description: "Physics project deadline extended to Friday",
                  time: "2 hours ago",
                  icon: FileCheck,
                  urgency: "normal",
                  color:
                    "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300",
                },
                {
                  title: "Quiz Tomorrow",
                  description: "Prepare for the Mathematics quiz at 10:00 AM",
                  time: "5 hours ago",
                  icon: AlertCircle,
                  urgency: "high",
                  color:
                    "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300",
                },
                {
                  title: "New Course Materials",
                  description:
                    "World Literature syllabus updated with new resources",
                  time: "1 day ago",
                  icon: BookOpen,
                  urgency: "normal",
                  color:
                    "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300",
                },
                {
                  title: "Field Trip Announcement",
                  description:
                    "Science Museum field trip scheduled for next week",
                  time: "2 days ago",
                  icon: Calendar,
                  urgency: "normal",
                  color:
                    "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${item.color}`}
                  >
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {item.title}
                      {item.urgency === "high" && (
                        <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground mt-0.5">
                      {item.description}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {item.time}
                    </div>
                  </div>
                </div>
              ))}
              <div className="pt-2 text-center">
                <Link to="/notifications">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 text-xs w-full"
                  >
                    <span>View All Notifications</span>
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Recent Activity
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>
              Your academic activities and progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {[
                {
                  title: "Essay Submission - World Literature",
                  description:
                    'You submitted "Analysis of Shakespeare\'s Sonnets" essay',
                  time: "Yesterday at 2:30 PM",
                  status: "Submitted",
                  progress: 100,
                  icon: FileCheck,
                  color:
                    "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300",
                },
                {
                  title: "Physics Chapter 5 Quiz",
                  description: 'You scored 92% on "Mechanics and Motion" quiz',
                  time: "2 days ago at 11:15 AM",
                  status: "Completed",
                  progress: 100,
                  icon: Star,
                  color:
                    "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300",
                },
                {
                  title: "Mathematics Module 3",
                  description:
                    'You completed 3 lessons from "Calculus Fundamentals"',
                  time: "3 days ago",
                  status: "In Progress",
                  progress: 65,
                  icon: BookOpen,
                  color:
                    "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300",
                },
                {
                  title: "Chemistry Lab Report",
                  description:
                    'You started working on "Acid-Base Reactions" lab report',
                  time: "5 days ago",
                  status: "In Progress",
                  progress: 30,
                  icon: Bookmark,
                  color:
                    "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="relative pl-8 before:absolute before:left-3 before:top-1 before:w-2 before:h-2 before:rounded-full before:bg-primary"
                >
                  <div className="absolute left-[9px] top-5 bottom-0 w-[1px] bg-border -z-10"></div>
                  <div className="mb-1 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${item.color}`}
                      >
                        <item.icon className="h-3.5 w-3.5" />
                      </div>
                      <span className="font-medium">{item.title}</span>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        item.status === "Submitted" ||
                        item.status === "Completed"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-3">
                    <Progress value={item.progress} className="h-1.5 flex-1">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${item.progress}%` }}
                      />
                    </Progress>
                    <span className="text-xs text-muted-foreground">
                      {item.progress}%
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    {item.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button variant="outline" className="w-full">
              View All Activity
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Modals */}

      {/* Attendance Modal */}
      <Dialog open={attendanceModalOpen} onOpenChange={setAttendanceModalOpen}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              Attendance Record
            </DialogTitle>
            <DialogDescription>
              Your attendance history for the current semester
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-1">
                <div className="text-lg font-medium">98% Attendance Rate</div>
                <div className="text-sm text-muted-foreground">
                  22 out of 23 school days attended
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Present: 22 days</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span>Absent: 1 day</span>
                </div>
              </div>
            </div>

            <Tabs defaultValue="calendar" className="w-full">
              <TabsList className="grid grid-cols-2 w-full mb-4">
                <TabsTrigger value="calendar">Calendar View</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
              </TabsList>

              <TabsContent value="calendar" className="space-y-4">
                <div className="grid grid-cols-7 gap-1 text-center">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (day, i) => (
                      <div key={i} className="text-xs font-medium py-1">
                        {day}
                      </div>
                    )
                  )}
                  {Array.from({ length: 30 }).map((_, i) => {
                    const isAbsent = i === 3; // Just for demo
                    const isToday = i === 9; // Just for demo
                    return (
                      <div
                        key={i}
                        className={`
                          flex items-center justify-center h-9 rounded-md text-xs
                          ${isToday ? "ring-2 ring-primary" : ""}
                          ${
                            i < 23
                              ? isAbsent
                                ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
                                : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                              : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                          }
                        `}
                      >
                        {i + 1}
                      </div>
                    );
                  })}
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  April 2025
                </div>
              </TabsContent>

              <TabsContent value="list">
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {attendanceData.map((record, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-md bg-slate-50 dark:bg-slate-900"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              record.status === "Present"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                                : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                            }`}
                          >
                            {record.status === "Present" ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <XCircle className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{record.class}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(record.date).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant={
                            record.status === "Present"
                              ? "outline"
                              : "destructive"
                          }
                        >
                          {record.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setAttendanceModalOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assignments Modal */}
      <Dialog
        open={assignmentsModalOpen}
        onOpenChange={setAssignmentsModalOpen}
      >
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-green-500" />
              Assignment Progress
            </DialogTitle>
            <DialogDescription>
              Track your assignments and submission status
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-center">
                <div className="text-xl font-bold text-green-600 dark:text-green-400">
                  85%
                </div>
                <div className="text-xs text-muted-foreground">
                  Completion Rate
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
                <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  17
                </div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg text-center">
                <div className="text-xl font-bold text-amber-600 dark:text-amber-400">
                  3
                </div>
                <div className="text-xs text-muted-foreground">Pending</div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium mb-2">Recent Assignments</h3>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-3">
                  {recentAssignments.map((assignment, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            assignment.status === "Completed"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                              : assignment.status === "In Progress"
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                              : "bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-300"
                          }`}
                        >
                          {assignment.status === "Completed" ? (
                            <Check className="h-4 w-4" />
                          ) : assignment.status === "In Progress" ? (
                            <Clock className="h-4 w-4" />
                          ) : (
                            <AlertCircle className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{assignment.title}</div>
                          <div className="text-xs text-muted-foreground">
                            Due:{" "}
                            {new Date(assignment.dueDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <Badge
                          variant={
                            assignment.status === "Completed"
                              ? "outline"
                              : assignment.status === "In Progress"
                              ? "secondary"
                              : "default"
                          }
                        >
                          {assignment.status}
                        </Badge>
                        {assignment.grade !== "-" && (
                          <div className="text-sm font-medium mt-1 text-green-600">
                            {assignment.grade}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              className="sm:flex-1"
              onClick={() => setAssignmentsModalOpen(false)}
            >
              Close
            </Button>
            <Link to="/assignments" className="sm:flex-1">
              <Button className="sm:flex-1 w-full">View All Assignments</Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* GPA Modal */}
      <Dialog open={gpaModalOpen} onOpenChange={setGpaModalOpen}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              Academic Performance
            </DialogTitle>
            <DialogDescription>
              Your current semester grades and GPA
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl mb-6">
              <div className="space-y-1">
                <div className="text-lg font-medium">Current GPA: 3.8</div>
                <div className="text-sm text-muted-foreground">
                  Spring Semester 2025
                </div>
              </div>
              <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-800 shadow-md flex items-center justify-center border-4 border-amber-200 dark:border-amber-600">
                <span className="text-lg font-bold text-amber-600">A-</span>
              </div>
            </div>

            <h3 className="text-sm font-medium mb-2">Course Grades</h3>
            <ScrollArea className="h-[250px] pr-4">
              <div className="space-y-3">
                {courseGrades.map((course, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{course.course}</div>
                      <div className="text-xs text-muted-foreground">
                        GPA: {course.gpa.toFixed(1)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold ${
                          course.grade.startsWith("A")
                            ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                            : course.grade.startsWith("B")
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                        }`}
                      >
                        {course.grade}
                      </div>
                      {course.trend === "up" && (
                        <div className="text-green-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="mt-6 bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-2">GPA Trend</h3>
              <div className="flex items-end h-[100px] justify-between mb-2">
                {[3.6, 3.5, 3.7, 3.8].map((gpa, i) => (
                  <div key={i} className="flex flex-col items-center w-1/4">
                    <div className="text-xs mb-1">{gpa.toFixed(1)}</div>
                    <div
                      className="w-8 bg-gradient-to-t from-primary/60 to-primary rounded-t-sm"
                      style={{ height: `${gpa * 20}px` }}
                    ></div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
                <div>Fall 2023</div>
                <div>Spring 2024</div>
                <div>Fall 2024</div>
                <div>Spring 2025</div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setGpaModalOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Course Progress Modal */}
      <Dialog open={progressModalOpen} onOpenChange={setProgressModalOpen}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Layers className="h-5 w-5 text-purple-500" />
              Course Progress Tracker
            </DialogTitle>
            <DialogDescription>
              Track your progress across all enrolled courses
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg text-center">
                <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                  76%
                </div>
                <div className="text-xs text-muted-foreground">
                  Overall Progress
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-center">
                <div className="text-xl font-bold text-green-600 dark:text-green-400">
                  120
                </div>
                <div className="text-xs text-muted-foreground">
                  Completed Materials
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
                <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  6
                </div>
                <div className="text-xs text-muted-foreground">
                  Active Courses
                </div>
              </div>
            </div>

            <h3 className="text-sm font-medium mb-2">Course Details</h3>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-3">
                {coursesProgress.map((course, i) => (
                  <div key={i} className="p-3 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{course.course}</div>
                      <Badge variant="outline">
                        {course.progress}% Complete
                      </Badge>
                    </div>
                    <Progress value={course.progress} className="h-2 mb-3">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-primary"
                        style={{ width: `${course.progress}%` }}
                      />
                    </Progress>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <div>
                        {course.completed} / {course.materials} materials
                        completed
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 px-2">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              className="sm:flex-1"
              onClick={() => setProgressModalOpen(false)}
            >
              Close
            </Button>
            <Link to="/courses" className="sm:flex-1">
              <Button className="sm:flex-1 w-full">Go to Courses</Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Dashboard;

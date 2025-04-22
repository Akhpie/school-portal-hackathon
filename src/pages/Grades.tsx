
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  GraduationCap, BookOpen, BarChart2, TrendingUp, 
  FileText, Download, Filter, Search, SortAsc, SortDesc
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const Grades = () => {
  const [semester, setSemester] = useState('current');
  const [sortType, setSortType] = useState('course'); // 'course', 'grade', 'recent'
  const [sortDirection, setSortDirection] = useState('asc');
  
  // Sample grades data for current semester
  const currentCourses = [
    {
      id: 1,
      code: 'MATH301',
      name: 'Advanced Mathematics',
      instructor: 'Dr. Thompson',
      credits: 4,
      grade: 'A',
      percentage: 94,
      assignments: [
        { name: 'Homework 1', score: 95, weight: 10 },
        { name: 'Midterm Exam', score: 92, weight: 30 },
        { name: 'Homework 2', score: 88, weight: 10 },
        { name: 'Final Project', score: 96, weight: 20 },
        { name: 'Final Exam', score: 94, weight: 30 },
      ]
    },
    {
      id: 2,
      code: 'LIT202',
      name: 'World Literature',
      instructor: 'Prof. Garcia',
      credits: 3,
      grade: 'A-',
      percentage: 90,
      assignments: [
        { name: 'Essay 1', score: 88, weight: 15 },
        { name: 'Participation', score: 95, weight: 10 },
        { name: 'Midterm Paper', score: 91, weight: 25 },
        { name: 'Essay 2', score: 89, weight: 15 },
        { name: 'Final Paper', score: 92, weight: 35 },
      ]
    },
    {
      id: 3,
      code: 'PHYS245',
      name: 'Physics II',
      instructor: 'Dr. Maxwell',
      credits: 4,
      grade: 'B+',
      percentage: 87,
      assignments: [
        { name: 'Lab 1', score: 88, weight: 10 },
        { name: 'Problem Set 1', score: 85, weight: 15 },
        { name: 'Midterm Exam', score: 82, weight: 25 },
        { name: 'Lab 2', score: 90, weight: 10 },
        { name: 'Problem Set 2', score: 89, weight: 15 },
        { name: 'Final Exam', score: 89, weight: 25 },
      ]
    },
    {
      id: 4,
      code: 'HIST300',
      name: 'World History',
      instructor: 'Dr. Patel',
      credits: 3,
      grade: 'A',
      percentage: 95,
      assignments: [
        { name: 'Research Paper Proposal', score: 94, weight: 10 },
        { name: 'Midterm Exam', score: 96, weight: 25 },
        { name: 'Research Paper', score: 95, weight: 35 },
        { name: 'Final Exam', score: 94, weight: 30 },
      ]
    },
    {
      id: 5,
      code: 'CHEM201',
      name: 'Organic Chemistry',
      instructor: 'Dr. Johnson',
      credits: 4,
      grade: 'B',
      percentage: 84,
      assignments: [
        { name: 'Lab Report 1', score: 82, weight: 10 },
        { name: 'Quiz 1', score: 78, weight: 10 },
        { name: 'Midterm Exam', score: 85, weight: 25 },
        { name: 'Lab Report 2', score: 86, weight: 10 },
        { name: 'Quiz 2', score: 80, weight: 10 },
        { name: 'Final Exam', score: 87, weight: 35 },
      ]
    }
  ];
  
  // Sample grades data for previous semester
  const previousCourses = [
    {
      id: 101,
      code: 'MATH201',
      name: 'Calculus II',
      instructor: 'Dr. Williams',
      credits: 4,
      grade: 'A',
      percentage: 96,
    },
    {
      id: 102,
      code: 'LIT101',
      name: 'Introduction to Literature',
      instructor: 'Prof. Lee',
      credits: 3,
      grade: 'A',
      percentage: 94,
    },
    {
      id: 103,
      code: 'PHYS101',
      name: 'Physics I',
      instructor: 'Dr. Maxwell',
      credits: 4,
      grade: 'A-',
      percentage: 91,
    },
    {
      id: 104,
      code: 'HIST101',
      name: 'Introduction to History',
      instructor: 'Dr. Chen',
      credits: 3,
      grade: 'B+',
      percentage: 88,
    },
    {
      id: 105,
      code: 'CHEM101',
      name: 'General Chemistry',
      instructor: 'Dr. Johnson',
      credits: 4,
      grade: 'B+',
      percentage: 87,
    }
  ];
  
  // GPA calculation
  const calculateGPA = (courses) => {
    const gradePoints = {
      'A+': 4.3, 'A': 4.0, 'A-': 3.7,
      'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7,
      'D+': 1.3, 'D': 1.0, 'D-': 0.7,
      'F': 0
    };
    
    let totalPoints = 0;
    let totalCredits = 0;
    
    courses.forEach(course => {
      totalPoints += gradePoints[course.grade] * course.credits;
      totalCredits += course.credits;
    });
    
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
  };
  
  // Sort function for courses
  const sortCourses = (courses) => {
    return [...courses].sort((a, b) => {
      let comparison = 0;
      
      if (sortType === 'course') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortType === 'grade') {
        comparison = b.percentage - a.percentage;
      } else if (sortType === 'recent') {
        comparison = b.id - a.id; // Assuming higher ID means more recent
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };
  
  // Convert letter grade to color
  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'text-green-600 dark:text-green-400';
    if (grade.startsWith('B')) return 'text-blue-600 dark:text-blue-400';
    if (grade.startsWith('C')) return 'text-amber-600 dark:text-amber-400';
    if (grade.startsWith('D')) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };
  
  // Chart data for grade trend
  const gradeProgress = [
    { name: 'Fall 2023', gpa: 3.6 },
    { name: 'Spring 2024', gpa: 3.7 },
    { name: 'Summer 2024', gpa: 3.8 },
    { name: 'Fall 2024', gpa: 3.9 },
    { name: 'Spring 2025', gpa: parseFloat(calculateGPA(currentCourses)) },
  ];
  
  // Get current semester courses
  const activeCourses = semester === 'current' ? currentCourses : previousCourses;
  const sortedCourses = sortCourses(activeCourses);
  
  // Calculate current and cumulative GPA
  const currentGPA = calculateGPA(currentCourses);
  const cumulativeGPA = (parseFloat(calculateGPA(currentCourses)) + parseFloat(calculateGPA(previousCourses))) / 2;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Grades</h1>
            <p className="text-muted-foreground">
              Track your academic performance and GPA
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
          </div>
        </div>
        
        {/* GPA Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Current GPA</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentGPA}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Spring 2025 Semester
              </p>
              <Progress value={parseFloat(currentGPA) * 25} className="h-1 mt-3" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Cumulative GPA</CardTitle>
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cumulativeGPA.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Overall Academic Performance
              </p>
              <Progress value={cumulativeGPA * 25} className="h-1 mt-3" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">GPA Trend</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">+0.1</div>
              <p className="text-xs text-muted-foreground mt-1">
                Improvement from Previous Semester
              </p>
              <Progress value={70} className="h-1 mt-3 bg-green-100 dark:bg-green-900">
                <div className="h-full bg-green-600 dark:bg-green-400 rounded-full" style={{ width: '70%' }} />
              </Progress>
            </CardContent>
          </Card>
        </div>
        
        {/* GPA Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">GPA Progress</CardTitle>
            <CardDescription>Your GPA trend over recent semesters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={gradeProgress}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis domain={[3.0, 4.0]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="gpa" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Courses and Grades */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Course Grades</CardTitle>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" className="gap-1" onClick={() => {
                  setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                }}>
                  {sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </Button>
                <div className="relative flex items-center">
                  <Search className="absolute left-2 h-4 w-4 text-muted-foreground" />
                  <input 
                    className="h-8 rounded-md pl-8 text-sm ring-offset-background bg-secondary px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Search courses..."
                  />
                </div>
              </div>
            </div>
            <CardDescription>View and analyze your academic performance</CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="current" onValueChange={setSemester}>
            <div className="px-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="current">Current Semester</TabsTrigger>
                <TabsTrigger value="previous">Previous Semesters</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="current" className="px-0">
              <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr className="bg-muted/50">
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                          onClick={() => {
                            setSortType('course');
                            setSortDirection(sortType === 'course' && sortDirection === 'asc' ? 'desc' : 'asc');
                          }}
                        >
                          <div className="flex items-center gap-1">
                            <span>Course</span>
                          </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Instructor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Credits
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                          onClick={() => {
                            setSortType('grade');
                            setSortDirection(sortType === 'grade' && sortDirection === 'asc' ? 'desc' : 'asc');
                          }}
                        >
                          <div className="flex items-center gap-1">
                            <span>Grade</span>
                          </div>
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                          Details
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-background">
                      {sortedCourses.map((course) => (
                        <tr key={course.id} className="hover:bg-muted/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="font-medium">{course.name}</div>
                            <div className="text-xs text-muted-foreground">{course.code}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {course.instructor}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {course.credits}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className={`font-bold ${getGradeColor(course.grade)}`}>{course.grade}</span>
                                <span className="text-muted-foreground">({course.percentage}%)</span>
                              </div>
                              <Progress value={course.percentage} className="h-1 w-20 mt-1" />
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                            <Button variant="ghost" size="sm" className="gap-1 text-xs">
                              <span>View Details</span>
                              <FileText className="h-3 w-3" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Assignment breakdown for the first course */}
              {semester === 'current' && (
                <div className="p-6 border-t mt-4">
                  <h3 className="text-md font-medium mb-3">Assignment Breakdown - {currentCourses[0].name}</h3>
                  <div className="space-y-4">
                    {currentCourses[0].assignments.map((assignment, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between">
                          <div className="text-sm">{assignment.name}</div>
                          <div className="text-sm font-medium">{assignment.score}%</div>
                        </div>
                        <div className="flex justify-between text-xs">
                          <div className="text-muted-foreground">Weight: {assignment.weight}%</div>
                          <div className="text-muted-foreground">Contribution: {(assignment.score * assignment.weight / 100).toFixed(1)}%</div>
                        </div>
                        <Progress value={assignment.score} className="h-1" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="previous" className="px-0">
              {/* Similar table structure as current semester tab */}
            </TabsContent>
          </Tabs>
        </Card>
        
        {/* Academic Standing */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Academic Standing</CardTitle>
            <CardDescription>Your academic status and achievements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 dark:bg-green-900 dark:text-green-400">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium">Dean's List</div>
                  <div className="text-sm text-muted-foreground">Fall 2024</div>
                </div>
              </div>
              <div className="text-green-600 dark:text-green-400 text-sm font-medium">Achieved</div>
            </div>
            
            <div className="flex items-center justify-between pb-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 dark:bg-green-900 dark:text-green-400">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium">Academic Scholarship</div>
                  <div className="text-sm text-muted-foreground">2024-2025 Academic Year</div>
                </div>
              </div>
              <div className="text-green-600 dark:text-green-400 text-sm font-medium">Maintained</div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 dark:bg-amber-900 dark:text-amber-400">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium">Graduation Requirements</div>
                  <div className="text-sm text-muted-foreground">Expected Graduation: Spring 2027</div>
                </div>
              </div>
              <div className="text-amber-600 dark:text-amber-400 text-sm font-medium">On Track</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Grades;

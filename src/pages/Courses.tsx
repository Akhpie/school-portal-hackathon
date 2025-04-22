import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Calendar,
  FileText,
  Layers,
  MessageSquare,
  UserCircle2,
  Book,
  BookmarkCheck,
  BookmarkPlus,
  FolderArchive,
  ChevronRight,
  MoreHorizontal,
  Archive,
  Bookmark,
  Filter,
  Sparkles,
  Clock,
  ArrowRight,
  Search,
  BarChart3,
  ChevronLeft,
  Star,
  Video,
  Check,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { toast } from "@/components/ui/sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Courses = () => {
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [showGradesDialog, setShowGradesDialog] = useState(false);
  const [showBookmarksDialog, setShowBookmarksDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [activeView, setActiveView] = useState("grid");
  const [bookmarkedCourses, setBookmarkedCourses] = useState<string[]>([]);
  const [moreInfoCourse, setMoreInfoCourse] = useState<any>(null);
  const [courseData, setCourseData] = useState(currentSemesterCourses);
  const [archivedCourses, setArchivedCourses] = useState<CourseData[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  // Load data from localStorage on component mount
  useEffect(() => {
    // Load bookmarked courses
    const storedBookmarks = localStorage.getItem("bookmarkedCourses");
    if (storedBookmarks) {
      try {
        setBookmarkedCourses(JSON.parse(storedBookmarks));
      } catch (e) {
        console.error("Error parsing bookmarked courses from localStorage:", e);
      }
    }

    // Load archived courses
    const storedArchived = localStorage.getItem("archivedCourses");
    if (storedArchived) {
      try {
        const archived = JSON.parse(storedArchived);
        setArchivedCourses(archived);

        // Filter current courses to remove archived ones
        const archivedCodes = archived.map((course: CourseData) => course.code);
        setCourseData(
          currentSemesterCourses.filter(
            (course) => !archivedCodes.includes(course.code)
          )
        );
      } catch (e) {
        console.error("Error parsing archived courses from localStorage:", e);
      }
    }
  }, []);

  // Check for mobile device
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Save bookmarked courses to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      "bookmarkedCourses",
      JSON.stringify(bookmarkedCourses)
    );
  }, [bookmarkedCourses]);

  // Save archived courses to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("archivedCourses", JSON.stringify(archivedCourses));
  }, [archivedCourses]);

  // Function to toggle bookmark for a course
  const toggleBookmark = (courseCode: string) => {
    if (bookmarkedCourses.includes(courseCode)) {
      setBookmarkedCourses(
        bookmarkedCourses.filter((code) => code !== courseCode)
      );
      toast.success("Bookmark removed", {
        description: "Course removed from your bookmarks",
      });
    } else {
      setBookmarkedCourses([...bookmarkedCourses, courseCode]);
      toast.success("Course bookmarked!", {
        description: "Course added to your bookmarks",
      });
    }
  };

  // Function to archive a course
  const archiveCourse = (course: CourseData) => {
    setArchivedCourses([...archivedCourses, course]);
    setCourseData(courseData.filter((c) => c.code !== course.code));
    toast.success("Course archived", {
      description: `${course.title} moved to archives`,
    });
  };

  // Function to restore course from archive
  const restoreCourse = (course: CourseData) => {
    setCourseData([...courseData, course]);
    setArchivedCourses(archivedCourses.filter((c) => c.code !== course.code));
    toast.success("Course restored", {
      description: `${course.title} moved back to current courses`,
    });
  };

  // Function to clear all bookmarks
  const clearAllBookmarks = () => {
    setBookmarkedCourses([]);
    toast.success("Bookmarks cleared", {
      description: "All bookmarks have been removed",
    });
  };

  // Function to clear all archived courses
  const clearAllArchived = () => {
    // Restore all archived courses first
    setCourseData([...courseData, ...archivedCourses]);
    setArchivedCourses([]);
    toast.success("Archives cleared", {
      description: "All archived courses have been restored",
    });
  };

  // Get bookmarked courses
  const getBookmarkedCourses = () => {
    return courseData.filter((course) =>
      bookmarkedCourses.includes(course.code)
    );
  };

  // Get active courses (filtered by search)
  const getActiveCourses = () => {
    return courseData.filter(
      (course) =>
        searchQuery === "" ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold gradient-text">My Courses</h1>
            <p className="text-muted-foreground">
              View and access your enrolled courses
            </p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search courses..."
                className="pl-8 h-9 w-[150px] md:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <Filter className="h-4 w-4 mr-2" />
                  <span>Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    toast.success("All courses showing", {
                      description: "Displaying all active courses",
                    });
                  }}
                >
                  All Courses
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    toast.success("Showing in-progress courses", {
                      description: "Filtered by courses currently in session",
                    });
                  }}
                >
                  In Progress
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    toast.success("Showing completed courses", {
                      description: "Filtered by courses you've completed",
                    });
                  }}
                >
                  Completed
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              size="sm"
              className="h-9"
              onClick={() => setShowBookmarksDialog(true)}
            >
              <Bookmark className="h-4 w-4 mr-2" />
              <span>Bookmarks</span>
            </Button>

            <div className="flex items-center rounded-md border p-1 h-9">
              <Button
                variant={activeView === "grid" ? "secondary" : "ghost"}
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setActiveView("grid")}
              >
                <Layers className="h-4 w-4" />
                <span className="sr-only">Grid view</span>
              </Button>
              <Button
                variant={activeView === "list" ? "secondary" : "ghost"}
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setActiveView("list")}
              >
                <BarChart3 className="h-4 w-4" />
                <span className="sr-only">List view</span>
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="current" className="w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-6">
            {/* Desktop Tabs */}
            <div className="hidden md:block w-full md:w-auto">
              <TabsList>
                <TabsTrigger value="current">Current Semester</TabsTrigger>
                <TabsTrigger value="archived">Archived</TabsTrigger>
              </TabsList>
            </div>

            {/* Mobile Tabs - Easier to tap */}
            <div className="md:hidden w-full">
              <div className="overflow-x-auto no-scrollbar">
                <div className="flex min-w-max">
                  <button
                    className={`px-4 py-2 text-sm font-medium border-b-2 ${
                      activeView === "current"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground"
                    }`}
                    onClick={() => setActiveView("current")}
                  >
                    Current Semester
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium border-b-2 ${
                      activeView === "archived"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground"
                    }`}
                    onClick={() => setActiveView("archived")}
                  >
                    Archived
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowScheduleDialog(true)}
                className="h-9 w-9 md:h-10 md:w-10"
              >
                <Calendar className="h-4 w-4 md:h-5 md:w-5" />
                <span className="sr-only">Schedule</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowGradesDialog(true)}
                className="h-9 w-9 md:h-10 md:w-10"
              >
                <FileText className="h-4 w-4 md:h-5 md:w-5" />
                <span className="sr-only">Grades</span>
              </Button>
            </div>
          </div>

          {/* Use the activeView state instead of TabsContent for mobile */}
          <div
            className={activeView === "current" ? "block" : "hidden md:block"}
          >
            <TabsContent value="current" className="m-0">
              {activeView === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {getActiveCourses().map((course, i) => (
                    <Card
                      key={i}
                      className="overflow-hidden hover:shadow-lg transition-all duration-300 border-t-4 h-full flex flex-col"
                      style={{ borderTopColor: course.colorHex }}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg md:text-xl">
                              {course.title}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-1 mt-1">
                              <span>{course.code}</span>
                              <span className="px-1">•</span>
                              <span>{course.instructor}</span>
                            </CardDescription>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`rounded-full ${
                              bookmarkedCourses.includes(course.code)
                                ? "text-primary"
                                : ""
                            }`}
                            onClick={() => toggleBookmark(course.code)}
                          >
                            <Bookmark
                              className={`h-4 w-4 text-muted-foreground ${
                                bookmarkedCourses.includes(course.code)
                                  ? "fill-primary text-primary"
                                  : ""
                              }`}
                            />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3 md:pb-4 flex-grow">
                        <div className="mb-3 md:mb-4 flex items-center gap-2">
                          <Progress
                            value={course.progress}
                            className="h-2 flex-1"
                          />
                          <Badge variant="outline">{course.progress}%</Badge>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-3 bg-muted/40 p-2 rounded-md">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <div className="text-sm">
                              <div className="font-medium">
                                Next: {course.upcoming}
                              </div>
                              <div className="text-muted-foreground text-xs">
                                {course.upcomingDate}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-x-2 text-xs md:text-sm">
                            <div className="flex items-center gap-1 md:gap-2">
                              <Calendar className="h-3.5 w-3.5 md:h-4 md:w-4 text-muted-foreground" />
                              <span className="truncate">
                                {course.schedule}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 md:gap-2">
                              <Layers className="h-3.5 w-3.5 md:h-4 md:w-4 text-muted-foreground" />
                              <span className="truncate">{course.room}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between border-t pt-3 md:pt-4 bg-muted/30">
                        <div className="flex gap-2 md:gap-4 text-xs md:text-sm">
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-3.5 w-3.5 md:h-4 md:w-4 text-muted-foreground" />
                            <span>{course.materials}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="h-3.5 w-3.5 md:h-4 md:w-4 text-muted-foreground" />
                            <span>{course.assignments}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 md:h-8 px-2 text-xs md:text-sm"
                            onClick={() => setMoreInfoCourse(course)}
                          >
                            Details
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            className="gap-1 group h-7 md:h-8 px-2 text-xs md:text-sm"
                            onClick={() => {
                              setSelectedCourse(course);
                              toast.success(`Opening ${course.title}`, {
                                description: "Loading course content...",
                              });
                            }}
                          >
                            <span>View</span>
                            <ArrowRight className="h-3.5 w-3.5 md:h-4 md:w-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {getActiveCourses().map((course, i) => (
                    <Card key={i} className="overflow-hidden">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4">
                        <div className="flex gap-4 items-center">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: `${course.colorHex}20` }}
                          >
                            <BookOpen
                              className="h-6 w-6"
                              style={{ color: course.colorHex }}
                            />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{course.title}</h3>
                              <Badge variant="outline">{course.code}</Badge>
                              {bookmarkedCourses.includes(course.code) && (
                                <Bookmark className="h-3.5 w-3.5 fill-primary text-primary" />
                              )}
                            </div>
                            <div className="flex flex-wrap text-sm text-muted-foreground gap-2">
                              <div className="flex items-center gap-1">
                                <UserCircle2 className="h-3.5 w-3.5" />
                                <span>{course.instructor}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>{course.schedule}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 items-center">
                          <div className="flex-1 w-full sm:w-40">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-muted-foreground">
                                Progress
                              </span>
                              <span className="font-medium">
                                {course.progress}%
                              </span>
                            </div>
                            <Progress value={course.progress} className="h-2" />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8"
                              onClick={() => setMoreInfoCourse(course)}
                            >
                              Details
                            </Button>
                            <Button
                              size="sm"
                              className="h-8"
                              onClick={() => {
                                setSelectedCourse(course);
                                toast.success(`Opening ${course.title}`, {
                                  description: "Loading course content...",
                                });
                              }}
                            >
                              View Course
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </div>

          <div
            className={activeView === "archived" ? "block" : "hidden md:block"}
          >
            <TabsContent value="archived" className="m-0">
              {archivedCourses.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex justify-end mb-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={clearAllArchived}
                    >
                      Restore All Courses
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {archivedCourses.map((course, i) => (
                      <Card key={i} className="overflow-hidden bg-muted/10">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-xl text-muted-foreground">
                                {course.title}
                              </CardTitle>
                              <CardDescription className="flex items-center gap-1 mt-1">
                                <span>{course.code}</span>
                                <span className="px-1">•</span>
                                <span>{course.instructor}</span>
                              </CardDescription>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-full"
                              onClick={() => setMoreInfoCourse(course)}
                            >
                              <FileText className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{course.schedule}</span>
                          </div>
                        </CardContent>
                        <CardFooter className="pt-2 flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => restoreCourse(course)}
                          >
                            <ArrowRight className="h-4 w-4 mr-2" />
                            Restore Course
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-muted/50 to-background rounded-lg p-8 text-center border border-dashed">
                  <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Archived Courses</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    Access your previous semester courses, materials, and grades
                    from the archive.
                  </p>
                  <Button
                    onClick={() => {
                      toast.success("Archives Loading", {
                        description: "Retrieving your past course data...",
                      });
                    }}
                  >
                    View Archives
                  </Button>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>

        {/* Recommended Courses Section */}
        <div className="mt-8 md:mt-10">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-bold">
              Recommended for You
            </h2>
            <Button variant="ghost" size="sm" className="gap-1">
              View All <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="overflow-x-auto no-scrollbar pb-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 min-w-[300px]">
              {recommendedCourses.map((course, i) => (
                <Card
                  key={i}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full"
                >
                  <div className="relative">
                    <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent h-32 w-full" />
                    <div className="absolute top-4 left-4 bg-primary/10 p-2 rounded-md">
                      <course.icon className="h-6 w-6 text-primary" />
                    </div>
                    <Badge
                      className="absolute top-4 right-4"
                      variant="secondary"
                    >
                      {course.level}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle>{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <UserCircle2 className="h-4 w-4 text-muted-foreground" />
                        <span>{course.instructor}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-muted-foreground" />
                        <span>{course.category}</span>
                      </div>
                      {course.rating && (
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < course.rating
                                    ? "text-yellow-500 fill-yellow-500"
                                    : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-muted-foreground">
                            ({course.ratingCount} reviews)
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const courseDetails = {
                          title: course.title,
                          code: `${course.category
                            .substring(0, 3)
                            .toUpperCase()}${
                            Math.floor(Math.random() * 400) + 100
                          }`,
                          instructor: course.instructor,
                          description: course.description,
                          progress: 0,
                          schedule: "TBD",
                          scheduleDays: [],
                          room: "TBD",
                          upcoming: "Course Introduction",
                          upcomingDate: "TBD",
                          materials: 0,
                          assignments: 0,
                          color: "bg-primary-100 text-primary-700",
                          colorHex: "#0284c7",
                          status: "Not Started",
                          icon: course.icon,
                        };
                        setMoreInfoCourse(courseDetails);
                      }}
                    >
                      More Info
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        toast.success("Course Enrollment", {
                          description: `Successfully enrolled in ${course.title}`,
                        });
                      }}
                    >
                      Enroll
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Educational Resources Section - Made more mobile friendly with scrollable cards */}
        <Card className="mt-8 md:mt-10 overflow-hidden border-none shadow-sm bg-gradient-to-b from-background to-muted/20">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">
              Educational Resources
            </CardTitle>
            <CardDescription>
              Additional learning materials and resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto no-scrollbar pb-1">
              <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 min-w-[700px] md:min-w-0">
                <div className="bg-background rounded-lg border p-4 md:p-5 text-center shadow-sm hover:shadow-md transition-all flex-shrink-0 w-[220px] md:w-auto">
                  <div className="w-10 h-10 md:w-12 md:h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Video className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-1">Video Tutorials</h3>
                  <p className="text-xs md:text-sm text-muted-foreground mb-4">
                    Access a library of instructional videos across all subjects
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs md:text-sm"
                    onClick={() => {
                      toast.success("Video Library", {
                        description: "Opening video tutorial library...",
                      });
                    }}
                  >
                    Browse Library
                  </Button>
                </div>

                <div className="bg-background rounded-lg border p-4 md:p-5 text-center shadow-sm hover:shadow-md transition-all flex-shrink-0 w-[220px] md:w-auto">
                  <div className="w-10 h-10 md:w-12 md:h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-1">Digital Textbooks</h3>
                  <p className="text-xs md:text-sm text-muted-foreground mb-4">
                    Access your course textbooks and reference materials online
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs md:text-sm"
                    onClick={() => {
                      toast.success("Digital Library", {
                        description: "Opening digital textbook library...",
                      });
                    }}
                  >
                    View Books
                  </Button>
                </div>

                <div className="bg-background rounded-lg border p-4 md:p-5 text-center shadow-sm hover:shadow-md transition-all flex-shrink-0 w-[220px] md:w-auto">
                  <div className="w-10 h-10 md:w-12 md:h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <UserCircle2 className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-1">Study Groups</h3>
                  <p className="text-xs md:text-sm text-muted-foreground mb-4">
                    Join peer study groups for collaborative learning
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs md:text-sm"
                    onClick={() => {
                      toast.success("Study Groups", {
                        description: "Finding available study groups...",
                      });
                    }}
                  >
                    Find Groups
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bookmarks Dialog/Drawer */}
        {isMobile ? (
          <Drawer
            open={showBookmarksDialog}
            onOpenChange={setShowBookmarksDialog}
          >
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Bookmarked Courses</DrawerTitle>
                <DrawerDescription>
                  Your saved courses for quick access
                </DrawerDescription>
              </DrawerHeader>

              <div className="px-4 py-2">
                {getBookmarkedCourses().length > 0 ? (
                  <>
                    <div className="flex justify-end mb-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={clearAllBookmarks}
                      >
                        Clear All Bookmarks
                      </Button>
                    </div>
                    <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                      {getBookmarkedCourses().map((course, i) => (
                        <Card key={i} className="overflow-hidden">
                          <div className="flex items-center p-4 gap-4">
                            <div
                              className="w-2 self-stretch rounded-l-md"
                              style={{ backgroundColor: course.colorHex }}
                            ></div>
                            <div className="flex-1">
                              <h3 className="font-medium">{course.title}</h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>{course.code}</span>
                                <span>•</span>
                                <span>{course.instructor}</span>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-primary"
                              onClick={() => toggleBookmark(course.code)}
                            >
                              <Bookmark className="h-5 w-5 fill-primary" />
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="py-8 text-center">
                    <div className="w-12 h-12 mx-auto rounded-full bg-muted flex items-center justify-center mb-3">
                      <Bookmark className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium mb-1">No bookmarked courses</h3>
                    <p className="text-sm text-muted-foreground">
                      Bookmark courses to add them to this list for quick access
                    </p>
                  </div>
                )}
              </div>

              <DrawerFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowBookmarksDialog(false)}
                >
                  Close
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        ) : (
          <Dialog
            open={showBookmarksDialog}
            onOpenChange={setShowBookmarksDialog}
          >
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Bookmarked Courses</DialogTitle>
                <DialogDescription>
                  Your saved courses for quick access
                </DialogDescription>
              </DialogHeader>

              <div className="py-4">
                {getBookmarkedCourses().length > 0 ? (
                  <>
                    <div className="flex justify-end mb-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={clearAllBookmarks}
                      >
                        Clear All Bookmarks
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {getBookmarkedCourses().map((course, i) => (
                        <Card key={i} className="overflow-hidden">
                          <div className="flex items-center p-4 gap-4">
                            <div
                              className="w-2 self-stretch rounded-l-md"
                              style={{ backgroundColor: course.colorHex }}
                            ></div>
                            <div className="flex-1">
                              <h3 className="font-medium">{course.title}</h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>{course.code}</span>
                                <span>•</span>
                                <span>{course.instructor}</span>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-primary"
                              onClick={() => toggleBookmark(course.code)}
                            >
                              <Bookmark className="h-5 w-5 fill-primary" />
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="py-8 text-center">
                    <div className="w-12 h-12 mx-auto rounded-full bg-muted flex items-center justify-center mb-3">
                      <Bookmark className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium mb-1">No bookmarked courses</h3>
                    <p className="text-sm text-muted-foreground">
                      Bookmark courses to add them to this list for quick access
                    </p>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowBookmarksDialog(false)}
                >
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Course Details Dialog/Drawer */}
        {isMobile ? (
          <Drawer
            open={moreInfoCourse !== null}
            onOpenChange={(open) => !open && setMoreInfoCourse(null)}
          >
            {moreInfoCourse && (
              <DrawerContent>
                <DrawerHeader className="border-b pb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-md flex items-center justify-center"
                      style={{
                        backgroundColor: `${moreInfoCourse.colorHex}20`,
                      }}
                    >
                      <BookOpen
                        className="h-6 w-6"
                        style={{ color: moreInfoCourse.colorHex }}
                      />
                    </div>
                    <div className="flex-1">
                      <DrawerTitle>{moreInfoCourse.title}</DrawerTitle>
                      <DrawerDescription className="flex items-center gap-1 mt-1">
                        <span>{moreInfoCourse.code}</span>
                        <span className="text-xs px-1">•</span>
                        <span>{moreInfoCourse.instructor}</span>
                      </DrawerDescription>
                    </div>
                  </div>
                </DrawerHeader>

                <div className="px-4 py-4 space-y-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">{moreInfoCourse.schedule}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Layers className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">{moreInfoCourse.room}</span>
                    </div>
                  </div>

                  <div className="bg-card p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Course Description</h3>
                    <p className="text-sm text-muted-foreground">
                      {moreInfoCourse.description ||
                        `An in-depth exploration of ${moreInfoCourse.title} concepts, principles, and applications in today's world. This course provides comprehensive coverage of fundamental topics and advanced techniques.`}
                    </p>
                  </div>

                  <div className="bg-card p-4 rounded-lg">
                    <h3 className="font-medium mb-3">Course Resources</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-accent/30 p-3 rounded-md">
                        <div className="font-medium text-sm">Materials</div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">
                            Available resources
                          </span>
                          <Badge variant="outline">
                            {moreInfoCourse.materials}
                          </Badge>
                        </div>
                      </div>
                      <div className="bg-accent/30 p-3 rounded-md">
                        <div className="font-medium text-sm">Assignments</div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">
                            Total assignments
                          </span>
                          <Badge variant="outline">
                            {moreInfoCourse.assignments}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-card">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Course Progress</h3>
                      <Badge variant="outline">
                        {moreInfoCourse.progress}%
                      </Badge>
                    </div>
                    <Progress value={moreInfoCourse.progress} className="h-2" />
                  </div>
                </div>

                <DrawerFooter className="border-t gap-2">
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        toggleBookmark(moreInfoCourse.code);
                      }}
                    >
                      {bookmarkedCourses.includes(moreInfoCourse.code) ? (
                        <>
                          <Bookmark className="h-4 w-4 mr-2 fill-primary" />
                          Bookmarked
                        </>
                      ) : (
                        <>
                          <Bookmark className="h-4 w-4 mr-2" />
                          Bookmark
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        archiveCourse(moreInfoCourse);
                        setMoreInfoCourse(null);
                      }}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Archive
                    </Button>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => {
                      toast.success(`Opening ${moreInfoCourse.title}`, {
                        description: "Loading course content...",
                      });
                      setMoreInfoCourse(null);
                    }}
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Go to Course
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            )}
          </Drawer>
        ) : (
          <Dialog
            open={moreInfoCourse !== null}
            onOpenChange={(open) => !open && setMoreInfoCourse(null)}
          >
            {moreInfoCourse && (
              <DialogContent className="sm:max-w-[650px]">
                <DialogHeader>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-md flex items-center justify-center"
                      style={{
                        backgroundColor: `${moreInfoCourse.colorHex}20`,
                      }}
                    >
                      <BookOpen
                        className="h-6 w-6"
                        style={{ color: moreInfoCourse.colorHex }}
                      />
                    </div>
                    <div>
                      <DialogTitle>{moreInfoCourse.title}</DialogTitle>
                      <DialogDescription>
                        {moreInfoCourse.code}
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                    <div className="flex items-center gap-2">
                      <UserCircle2 className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">
                        {moreInfoCourse.instructor}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <span>{moreInfoCourse.schedule}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Layers className="h-5 w-5 text-muted-foreground" />
                      <span>{moreInfoCourse.room}</span>
                    </div>
                  </div>

                  <div className="bg-muted/20 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Course Description</h3>
                    <p className="text-sm">
                      {moreInfoCourse.description ||
                        `An in-depth exploration of ${moreInfoCourse.title} concepts, principles, and applications in today's world. This course provides comprehensive coverage of fundamental topics and advanced techniques.`}
                    </p>
                  </div>

                  <div className="bg-muted/20 p-4 rounded-lg">
                    <h3 className="font-medium mb-3">Course Resources</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-background p-3 rounded-md">
                        <div className="font-medium">Materials</div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Available resources
                          </span>
                          <Badge variant="outline">
                            {moreInfoCourse.materials}
                          </Badge>
                        </div>
                      </div>
                      <div className="bg-background p-3 rounded-md">
                        <div className="font-medium">Assignments</div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Total assignments
                          </span>
                          <Badge variant="outline">
                            {moreInfoCourse.assignments}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/20">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Course Progress</h3>
                      <Badge variant="outline">
                        {moreInfoCourse.progress}%
                      </Badge>
                    </div>
                    <Progress value={moreInfoCourse.progress} className="h-2" />
                  </div>
                </div>

                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    className="sm:flex-1"
                    onClick={() => {
                      toggleBookmark(moreInfoCourse.code);
                    }}
                  >
                    {bookmarkedCourses.includes(moreInfoCourse.code) ? (
                      <>
                        <Bookmark className="h-4 w-4 mr-2 fill-primary" />
                        Bookmarked
                      </>
                    ) : (
                      <>
                        <Bookmark className="h-4 w-4 mr-2" />
                        Bookmark
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="sm:flex-1"
                    onClick={() => {
                      archiveCourse(moreInfoCourse);
                      setMoreInfoCourse(null);
                    }}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Archive Course
                  </Button>
                  <Button
                    className="sm:flex-1"
                    onClick={() => {
                      toast.success(`Opening ${moreInfoCourse.title}`, {
                        description: "Loading course content...",
                      });
                      setMoreInfoCourse(null);
                    }}
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Go to Course
                  </Button>
                </DialogFooter>
              </DialogContent>
            )}
          </Dialog>
        )}

        {/* Schedule Drawer/Dialog */}
        {isMobile ? (
          <Drawer
            open={showScheduleDialog}
            onOpenChange={setShowScheduleDialog}
          >
            <DrawerContent className="max-h-[90vh] overflow-auto">
              <DrawerHeader>
                <DrawerTitle className="text-xl">Weekly Schedule</DrawerTitle>
                <DrawerDescription>
                  View and manage your course schedule
                </DrawerDescription>
              </DrawerHeader>
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4 px-4">
                <div className="md:col-span-5 overflow-y-auto pr-0 md:pr-4 max-h-[500px]">
                  <div className="flex justify-between items-center mb-6 px-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => {
                        const prevWeek = new Date(date);
                        prevWeek.setDate(prevWeek.getDate() - 7);
                        setDate(prevWeek);
                      }}
                    >
                      <ChevronLeft className="h-4 w-4" /> Previous
                    </Button>
                    <div className="text-center">
                      <h4 className="font-medium text-lg">
                        {date.toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Week of{" "}
                        {date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => {
                        const nextWeek = new Date(date);
                        nextWeek.setDate(nextWeek.getDate() + 7);
                        setDate(nextWeek);
                      }}
                    >
                      Next <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-6 pb-4">
                    {[
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                    ].map((day) => (
                      <div key={day} className="rounded-lg overflow-hidden">
                        <div className="bg-slate-900 dark:bg-slate-800 p-3 px-4">
                          <h3 className="font-medium text-white">{day}</h3>
                        </div>
                        <div className="p-0">
                          {courseData
                            .filter((course) =>
                              course.scheduleDays.includes(
                                day.toLowerCase().substring(0, 3)
                              )
                            )
                            .map((course, i) => (
                              <div
                                key={i}
                                className="p-4 flex gap-4 border-b dark:border-slate-700"
                              >
                                <div
                                  className="w-1.5 self-stretch rounded-full"
                                  style={{ backgroundColor: course.colorHex }}
                                ></div>
                                <div>
                                  <div className="text-base font-bold mb-1">
                                    {course.schedule.split(" ")[1]}
                                  </div>
                                  <div className="flex flex-col gap-1">
                                    <div className="font-medium">
                                      {course.title}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {course.room}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          {!courseData.some((course) =>
                            course.scheduleDays.includes(
                              day.toLowerCase().substring(0, 3)
                            )
                          ) && (
                            <div className="py-10 text-center text-muted-foreground">
                              No classes scheduled
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2 md:pl-4 md:border-l flex flex-col items-center">
                  <div className="w-full flex justify-center mb-4">
                    <CalendarComponent
                      mode="single"
                      selected={date}
                      onSelect={(date) => date && setDate(date)}
                      className="rounded-md border shadow-sm mx-auto"
                      showOutsideDays={false}
                    />
                  </div>
                  <div className="mt-4 w-full">
                    <h4 className="font-medium mb-4 text-lg">
                      Upcoming Events
                    </h4>
                    <div className="space-y-3">
                      {courseData.map((course, i) => (
                        <div
                          key={i}
                          className="rounded-md p-3 bg-slate-800/20 dark:bg-slate-800"
                        >
                          <div className="font-medium mb-1">
                            {course.upcoming}
                          </div>
                          <div className="text-sm text-muted-foreground flex justify-between">
                            <span>
                              April{" "}
                              {course.upcomingDate
                                .split(" ")[1]
                                .replace(/\D/g, "")}
                            </span>
                            <span>{course.code}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <DrawerFooter className="mt-8 gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowScheduleDialog(false)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    toast.success("Schedule saved", {
                      description:
                        "Your schedule has been synced with your calendar",
                    });
                    setShowScheduleDialog(false);
                  }}
                >
                  Sync Calendar
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        ) : (
          <Dialog
            open={showScheduleDialog}
            onOpenChange={setShowScheduleDialog}
          >
            <DialogContent className="sm:max-w-[1200px] max-h-[80vh] overflow-hidden bg-background dark:bg-slate-900">
              <DialogHeader>
                <DialogTitle className="text-xl">Weekly Schedule</DialogTitle>
                <DialogDescription>
                  View and manage your course schedule
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4 h-full overflow-hidden">
                <div className="md:col-span-5 overflow-y-auto pr-0 md:pr-4 max-h-[500px]">
                  <div className="flex justify-between items-center mb-6 px-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => {
                        const prevWeek = new Date(date);
                        prevWeek.setDate(prevWeek.getDate() - 7);
                        setDate(prevWeek);
                      }}
                    >
                      <ChevronLeft className="h-4 w-4" /> Previous
                    </Button>
                    <div className="text-center">
                      <h4 className="font-medium text-lg">
                        {date.toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Week of{" "}
                        {date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => {
                        const nextWeek = new Date(date);
                        nextWeek.setDate(nextWeek.getDate() + 7);
                        setDate(nextWeek);
                      }}
                    >
                      Next <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-6 pb-4">
                    {[
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                    ].map((day) => (
                      <div key={day} className="rounded-lg overflow-hidden">
                        <div className="bg-slate-900 dark:bg-slate-800 p-3 px-4">
                          <h3 className="font-medium text-white">{day}</h3>
                        </div>
                        <div className="p-0">
                          {courseData
                            .filter((course) =>
                              course.scheduleDays.includes(
                                day.toLowerCase().substring(0, 3)
                              )
                            )
                            .map((course, i) => (
                              <div
                                key={i}
                                className="p-4 flex gap-4 border-b dark:border-slate-700"
                              >
                                <div
                                  className="w-1.5 self-stretch rounded-full"
                                  style={{ backgroundColor: course.colorHex }}
                                ></div>
                                <div>
                                  <div className="text-base font-bold mb-1">
                                    {course.schedule.split(" ")[1]}
                                  </div>
                                  <div className="flex flex-col gap-1">
                                    <div className="font-medium">
                                      {course.title}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {course.room}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          {!courseData.some((course) =>
                            course.scheduleDays.includes(
                              day.toLowerCase().substring(0, 3)
                            )
                          ) && (
                            <div className="py-10 text-center text-muted-foreground">
                              No classes scheduled
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2 md:pl-4 md:border-l flex flex-col items-center">
                  <div className="w-full flex justify-center mb-4">
                    <CalendarComponent
                      mode="single"
                      selected={date}
                      onSelect={(date) => date && setDate(date)}
                      className="rounded-md border shadow-sm mx-auto"
                      showOutsideDays={false}
                    />
                  </div>
                  <div className="mt-4 w-full">
                    <h4 className="font-medium mb-4 text-lg">
                      Upcoming Events
                    </h4>
                    <div className="space-y-3">
                      {courseData.map((course, i) => (
                        <div
                          key={i}
                          className="rounded-md p-3 bg-slate-800/20 dark:bg-slate-800"
                        >
                          <div className="font-medium mb-1">
                            {course.upcoming}
                          </div>
                          <div className="text-sm text-muted-foreground flex justify-between">
                            <span>
                              April{" "}
                              {course.upcomingDate
                                .split(" ")[1]
                                .replace(/\D/g, "")}
                            </span>
                            <span>{course.code}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter className="mt-8 gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowScheduleDialog(false)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    toast.success("Schedule saved", {
                      description:
                        "Your schedule has been synced with your calendar",
                    });
                    setShowScheduleDialog(false);
                  }}
                >
                  Sync Calendar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Grades Drawer/Dialog */}
        {isMobile ? (
          <Drawer open={showGradesDialog} onOpenChange={setShowGradesDialog}>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Academic Performance</DrawerTitle>
                <DrawerDescription>
                  View your grades and academic progress
                </DrawerDescription>
              </DrawerHeader>
              <div className="space-y-4 py-2 px-4">
                <div className="bg-muted/20 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Current Semester GPA</h3>
                    <Badge>3.85/4.0</Badge>
                  </div>
                  <Progress value={96} className="h-2 mb-1" />
                  <p className="text-xs text-muted-foreground text-right">
                    Excellent standing
                  </p>
                </div>

                <div className="divide-y">
                  {courseData.map((course, i) => (
                    <div key={i} className="py-3 grid grid-cols-4 gap-2">
                      <div className="col-span-2">
                        <div className="font-medium">{course.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {course.code}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">
                          {course.grade || "--"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Grade
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-sm font-medium ${getStatusColor(
                            course.status
                          )}`}
                        >
                          {course.status}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Status
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-muted/20 rounded-lg p-4">
                  <h3 className="font-medium mb-3">Recent Submissions</h3>
                  <div className="space-y-2">
                    {[
                      {
                        title: "Mid-term Paper",
                        course: "World Literature",
                        grade: "A",
                        date: "Apr 18",
                      },
                      {
                        title: "Problem Set 4",
                        course: "Advanced Mathematics",
                        grade: "A-",
                        date: "Apr 15",
                      },
                      {
                        title: "Lab Report",
                        course: "Physics: Mechanics & Motion",
                        grade: "B+",
                        date: "Apr 12",
                      },
                    ].map((submission, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center text-sm p-2 rounded-md bg-background"
                      >
                        <div>
                          <div className="font-medium">{submission.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {submission.course}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{submission.grade}</Badge>
                          <div className="text-muted-foreground text-xs">
                            {submission.date}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DrawerFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowGradesDialog(false)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    toast.success("Report Generated", {
                      description: "Academic report downloaded successfully",
                    });
                  }}
                >
                  Download Report
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        ) : (
          <Dialog open={showGradesDialog} onOpenChange={setShowGradesDialog}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Academic Performance</DialogTitle>
                <DialogDescription>
                  View your grades and academic progress
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="bg-muted/20 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Current Semester GPA</h3>
                    <Badge>3.85/4.0</Badge>
                  </div>
                  <Progress value={96} className="h-2 mb-1" />
                  <p className="text-xs text-muted-foreground text-right">
                    Excellent standing
                  </p>
                </div>

                <div className="divide-y">
                  {courseData.map((course, i) => (
                    <div key={i} className="py-3 grid grid-cols-4 gap-2">
                      <div className="col-span-2">
                        <div className="font-medium">{course.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {course.code}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">
                          {course.grade || "--"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Grade
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-sm font-medium ${getStatusColor(
                            course.status
                          )}`}
                        >
                          {course.status}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Status
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-muted/20 rounded-lg p-4">
                  <h3 className="font-medium mb-3">Recent Submissions</h3>
                  <div className="space-y-2">
                    {[
                      {
                        title: "Mid-term Paper",
                        course: "World Literature",
                        grade: "A",
                        date: "Apr 18",
                      },
                      {
                        title: "Problem Set 4",
                        course: "Advanced Mathematics",
                        grade: "A-",
                        date: "Apr 15",
                      },
                      {
                        title: "Lab Report",
                        course: "Physics: Mechanics & Motion",
                        grade: "B+",
                        date: "Apr 12",
                      },
                    ].map((submission, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center text-sm p-2 rounded-md bg-background"
                      >
                        <div>
                          <div className="font-medium">{submission.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {submission.course}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{submission.grade}</Badge>
                          <div className="text-muted-foreground text-xs">
                            {submission.date}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowGradesDialog(false)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    toast.success("Report Generated", {
                      description: "Academic report downloaded successfully",
                    });
                  }}
                >
                  Download Report
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DashboardLayout>
  );
};

// Types and mock data
interface CourseData {
  title: string;
  code: string;
  instructor: string;
  progress: number;
  schedule: string;
  scheduleDays: string[];
  room: string;
  upcoming: string;
  upcomingDate: string;
  materials: number;
  assignments: number;
  color: string;
  colorHex: string;
  status: string;
  grade?: string;
}

// Helper function for grade status color
const getStatusColor = (status: string) => {
  switch (status) {
    case "Excellent":
      return "text-green-600 dark:text-green-400";
    case "Good":
      return "text-blue-600 dark:text-blue-400";
    case "Satisfactory":
      return "text-yellow-600 dark:text-yellow-400";
    case "Needs Improvement":
      return "text-red-600 dark:text-red-400";
    default:
      return "";
  }
};

// Mock data for current semester courses
const currentSemesterCourses: CourseData[] = [
  {
    title: "Advanced Mathematics",
    code: "MATH401",
    instructor: "Dr. Robert Chen",
    progress: 78,
    schedule: "MWF 10:00 - 11:30 AM",
    scheduleDays: ["mon", "wed", "fri"],
    room: "Science Building 302",
    upcoming: "Mid-term Exam",
    upcomingDate: "April 22",
    materials: 24,
    assignments: 8,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    colorHex: "#3b82f6",
    status: "Excellent",
    grade: "A",
  },
  {
    title: "Physics: Mechanics & Motion",
    code: "PHYS302",
    instructor: "Prof. Sarah Johnson",
    progress: 65,
    schedule: "TR 1:00 - 2:30 PM",
    scheduleDays: ["tue", "thu"],
    room: "Lab Building 101",
    upcoming: "Lab Report Due",
    upcomingDate: "April 19",
    materials: 18,
    assignments: 6,
    color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    colorHex: "#22c55e",
    status: "Good",
    grade: "B+",
  },
  {
    title: "World Literature",
    code: "LIT205",
    instructor: "Dr. Emily Parker",
    progress: 82,
    schedule: "TR 9:00 - 10:30 AM",
    scheduleDays: ["tue", "thu"],
    room: "Humanities 205",
    upcoming: "Essay Submission",
    upcomingDate: "April 25",
    materials: 32,
    assignments: 5,
    color:
      "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    colorHex: "#a855f7",
    status: "Excellent",
    grade: "A-",
  },
  {
    title: "Computer Science Fundamentals",
    code: "CS101",
    instructor: "Prof. Michael Lee",
    progress: 90,
    schedule: "MWF 2:00 - 3:30 PM",
    scheduleDays: ["mon", "wed", "fri"],
    room: "Tech Center 405",
    upcoming: "Coding Project",
    upcomingDate: "April 20",
    materials: 28,
    assignments: 10,
    color:
      "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
    colorHex: "#f97316",
    status: "Excellent",
    grade: "A",
  },
];

// Mock data for recommended courses
const recommendedCourses = [
  {
    title: "Advanced Creative Writing",
    description:
      "Develop advanced fiction writing techniques and storytelling skills.",
    instructor: "Prof. Lisa Montgomery",
    duration: "8 Weeks",
    level: "Advanced",
    category: "Language Arts",
    icon: BookOpen,
    rating: 4,
    ratingCount: 124,
  },
  {
    title: "Introduction to Data Science",
    description:
      "Learn the fundamentals of data analysis, visualization, and basic machine learning.",
    instructor: "Dr. James Wilson",
    duration: "10 Weeks",
    level: "Beginner",
    category: "Computer Science",
    icon: Layers,
    rating: 5,
    ratingCount: 237,
  },
  {
    title: "Public Speaking Mastery",
    description:
      "Build confidence and develop effective communication skills for presentations.",
    instructor: "Ms. Sophia Garcia",
    duration: "6 Weeks",
    level: "Intermediate",
    category: "Communications",
    icon: MessageSquare,
    rating: 4,
    ratingCount: 98,
  },
];

export default Courses;

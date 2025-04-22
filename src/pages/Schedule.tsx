import React, { useState, useRef, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  CalendarClock,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  GraduationCap,
  MapPin,
  Search,
  Users,
  X,
  BookOpen,
  Calendar as CalendarIcon,
  ArrowUpDown,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

type CourseScheduleEvent = {
  id: number;
  title: string;
  courseCode: string;
  instructor: string;
  type: "lecture" | "lab" | "seminar" | "break" | "exam" | "office-hours";
  day:
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";
  startTime: string;
  endTime: string;
  location: string;
  recurring: boolean;
  color: string;
};

const Schedule = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<"week" | "day" | "month">("week");
  const [filter, setFilter] = useState<"all" | "lectures" | "labs" | "exams">(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen]);

  // Focus the input when search is opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Close search with Escape key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isSearchOpen]);

  // Generate days of the current week
  const currentWeekDays = getWeekDays(date);

  // Sample schedule data - in production this would come from an API
  const scheduleEvents: CourseScheduleEvent[] = [
    {
      id: 1,
      title: "Advanced Mathematics",
      courseCode: "MATH401",
      instructor: "Dr. Robert Chen",
      type: "lecture",
      day: "monday",
      startTime: "08:30",
      endTime: "10:00",
      location: "Science Building 302",
      recurring: true,
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    },
    {
      id: 2,
      title: "Physics: Mechanics & Motion",
      courseCode: "PHYS302",
      instructor: "Prof. Sarah Johnson",
      type: "lecture",
      day: "monday",
      startTime: "10:15",
      endTime: "11:45",
      location: "Lab Building 101",
      recurring: true,
      color:
        "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    },
    {
      id: 3,
      title: "Lunch Break",
      courseCode: "",
      instructor: "",
      type: "break",
      day: "monday",
      startTime: "12:00",
      endTime: "13:00",
      location: "Cafeteria",
      recurring: true,
      color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    },
    {
      id: 4,
      title: "World Literature",
      courseCode: "LIT205",
      instructor: "Dr. Emily Parker",
      type: "lecture",
      day: "monday",
      startTime: "13:30",
      endTime: "15:00",
      location: "Humanities 205",
      recurring: true,
      color:
        "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    },
    {
      id: 5,
      title: "Physics Lab",
      courseCode: "PHYS302L",
      instructor: "Dr. Michael Weber",
      type: "lab",
      day: "tuesday",
      startTime: "09:00",
      endTime: "11:30",
      location: "Science Lab 101",
      recurring: true,
      color:
        "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    },
    {
      id: 6,
      title: "Lunch Break",
      courseCode: "",
      instructor: "",
      type: "break",
      day: "tuesday",
      startTime: "12:00",
      endTime: "13:00",
      location: "Cafeteria",
      recurring: true,
      color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    },
    {
      id: 7,
      title: "Calculus Study Group",
      courseCode: "MATH401",
      instructor: "",
      type: "seminar",
      day: "tuesday",
      startTime: "14:00",
      endTime: "15:30",
      location: "Library Study Room 3",
      recurring: true,
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    },
    {
      id: 8,
      title: "Computer Science",
      courseCode: "CS201",
      instructor: "Prof. Alex Mercer",
      type: "lecture",
      day: "wednesday",
      startTime: "08:30",
      endTime: "10:00",
      location: "Tech Building 205",
      recurring: true,
      color:
        "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
    },
    {
      id: 9,
      title: "Advanced Mathematics",
      courseCode: "MATH401",
      instructor: "Dr. Robert Chen",
      type: "lecture",
      day: "wednesday",
      startTime: "10:15",
      endTime: "11:45",
      location: "Science Building 302",
      recurring: true,
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    },
    {
      id: 10,
      title: "Lunch Break",
      courseCode: "",
      instructor: "",
      type: "break",
      day: "wednesday",
      startTime: "12:00",
      endTime: "13:00",
      location: "Cafeteria",
      recurring: true,
      color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    },
    {
      id: 11,
      title: "Office Hours - Dr. Chen",
      courseCode: "MATH401",
      instructor: "Dr. Robert Chen",
      type: "office-hours",
      day: "wednesday",
      startTime: "14:00",
      endTime: "15:00",
      location: "Faculty Office 412",
      recurring: true,
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    },
    {
      id: 12,
      title: "World Literature",
      courseCode: "LIT205",
      instructor: "Dr. Emily Parker",
      type: "lecture",
      day: "thursday",
      startTime: "09:00",
      endTime: "10:30",
      location: "Humanities 205",
      recurring: true,
      color:
        "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    },
    {
      id: 13,
      title: "Computer Science Lab",
      courseCode: "CS201L",
      instructor: "Prof. Alex Mercer",
      type: "lab",
      day: "thursday",
      startTime: "11:00",
      endTime: "13:00",
      location: "Computer Lab 305",
      recurring: true,
      color:
        "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
    },
    {
      id: 14,
      title: "Literature Study Group",
      courseCode: "LIT205",
      instructor: "",
      type: "seminar",
      day: "thursday",
      startTime: "14:00",
      endTime: "15:30",
      location: "Humanities Study Room 2",
      recurring: true,
      color:
        "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    },
    {
      id: 15,
      title: "Physics: Mechanics & Motion",
      courseCode: "PHYS302",
      instructor: "Prof. Sarah Johnson",
      type: "lecture",
      day: "friday",
      startTime: "08:30",
      endTime: "10:00",
      location: "Lab Building 101",
      recurring: true,
      color:
        "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    },
    {
      id: 16,
      title: "Mathematics Midterm Exam",
      courseCode: "MATH401",
      instructor: "Dr. Robert Chen",
      type: "exam",
      day: "friday",
      startTime: "11:00",
      endTime: "13:00",
      location: "Examination Hall A",
      recurring: false,
      color: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    },
    {
      id: 17,
      title: "Computer Science",
      courseCode: "CS201",
      instructor: "Prof. Alex Mercer",
      type: "lecture",
      day: "friday",
      startTime: "14:00",
      endTime: "15:30",
      location: "Tech Building 205",
      recurring: true,
      color:
        "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
    },
  ];

  // Search results based on query
  const searchResults =
    searchQuery.trim() !== ""
      ? scheduleEvents.filter((event) => {
          const query = searchQuery.toLowerCase();
          return (
            event.title.toLowerCase().includes(query) ||
            event.courseCode.toLowerCase().includes(query) ||
            event.instructor.toLowerCase().includes(query) ||
            event.location.toLowerCase().includes(query)
          );
        })
      : [];

  // Filter events based on filter selection and search query
  const filteredEvents = scheduleEvents.filter((event) => {
    // Apply type filter
    if (filter !== "all") {
      if (filter === "lectures" && event.type !== "lecture") return false;
      if (filter === "labs" && event.type !== "lab") return false;
      if (filter === "exams" && event.type !== "exam") return false;
    }

    // Apply search filter if there's a search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      return (
        event.title.toLowerCase().includes(query) ||
        event.courseCode.toLowerCase().includes(query) ||
        event.instructor.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Helper function to navigate to the previous week
  const goToPreviousWeek = () => {
    const prevWeek = new Date(date);
    prevWeek.setDate(prevWeek.getDate() - 7);
    setDate(prevWeek);
  };

  // Helper function to navigate to the next week
  const goToNextWeek = () => {
    const nextWeek = new Date(date);
    nextWeek.setDate(nextWeek.getDate() + 7);
    setDate(nextWeek);
  };

  // Helper function to navigate to today
  const goToToday = () => {
    setDate(new Date());
  };

  // Function to get events for a specific day
  const getEventsForDay = (day: string) => {
    return filteredEvents.filter((event) => event.day === day.toLowerCase());
  };

  // Helper to handle date selection from calendar
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setDate(date);
      setView("day");
    }
  };

  // Helper to get event background and text color classes
  const getEventColorClasses = (type: string) => {
    switch (type) {
      case "lecture":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "lab":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "seminar":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "exam":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "break":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      case "office-hours":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  // Get the display format for a time range
  const getTimeRangeDisplay = (startTime: string, endTime: string) => {
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  };

  // Get icon based on event type
  const getEventIcon = (type: string) => {
    switch (type) {
      case "lecture":
        return BookOpen;
      case "lab":
        return BookOpen;
      case "exam":
        return GraduationCap;
      case "office-hours":
        return Users;
      case "seminar":
        return Users;
      default:
        return CalendarIcon;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold gradient-text">
              Schedule
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Manage your classes, labs, and academic events
            </p>
          </div>
          <div className="flex items-center gap-2 mt-2 md:mt-0">
            <div className="relative flex items-center bg-muted rounded-md p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={goToPreviousWeek}
                className="h-8 px-2 rounded-sm"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={goToToday}
                className="h-8 text-xs font-medium px-2 rounded-sm"
              >
                Today
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={goToNextWeek}
                className="h-8 px-2 rounded-sm"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <Tabs
          defaultValue="week"
          onValueChange={(v) => setView(v as typeof view)}
          className="w-full"
        >
          <div className="flex flex-col sm:flex-row justify-between gap-2 md:gap-4 mb-4 md:mb-6">
            <TabsList className="w-full sm:w-auto rounded-lg">
              <TabsTrigger
                value="week"
                className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Week
              </TabsTrigger>
              <TabsTrigger
                value="day"
                className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Day
              </TabsTrigger>
              <TabsTrigger
                value="month"
                className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Month
              </TabsTrigger>
            </TabsList>
            <div className="flex gap-2 items-center">
              {/* Search Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-1"
              >
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Search</span>
              </Button>

              {/* Events Filter */}
              <div className="relative">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as typeof filter)}
                  className="h-9 appearance-none rounded-md border border-input bg-background px-3 pr-8 py-1 text-sm focus:outline-none"
                >
                  <option value="all">All Events</option>
                  <option value="lectures">Lectures</option>
                  <option value="labs">Labs</option>
                  <option value="exams">Exams</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>

          {/* Central Search Modal */}
          {isSearchOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-[10vh]">
              <div
                ref={searchInputRef}
                className="w-[95%] max-w-2xl mx-auto bg-background rounded-xl shadow-xl overflow-hidden"
              >
                {/* Search Input */}
                <div className="flex items-center p-3 border-b">
                  <Search className="h-5 w-5 text-muted-foreground mr-2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search events, courses, instructors..."
                    className="flex-1 bg-transparent border-0 focus:outline-none text-base"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSearchOpen(false)}
                    className="h-8 w-8 p-0 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Search Results */}
                <div className="max-h-[60vh] overflow-y-auto">
                  {searchQuery.trim() !== "" && (
                    <div className="p-3 text-sm text-muted-foreground bg-muted/30 border-b">
                      Found {searchResults.length}{" "}
                      {searchResults.length === 1 ? "result" : "results"} for "
                      {searchQuery}"
                    </div>
                  )}

                  {searchQuery.trim() === "" ? (
                    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                      <Search className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                      <p className="text-muted-foreground">
                        Start typing to search your schedule
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Search across events, courses, instructors, and
                        locations
                      </p>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="divide-y">
                      {searchResults.map((result) => {
                        const EventIcon = getEventIcon(result.type);
                        return (
                          <div
                            key={result.id}
                            className="p-4 hover:bg-muted/20 cursor-pointer transition-colors"
                            onClick={() => {
                              setDate(getDateForDay(result.day));
                              setView("day");
                              setIsSearchOpen(false);
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`flex-shrink-0 h-9 w-9 rounded-md flex items-center justify-center ${getEventColorClasses(
                                  result.type
                                )}`}
                              >
                                <EventIcon className="h-5 w-5" />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium line-clamp-1">
                                  {result.title}
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                  {result.courseCode && (
                                    <span className="inline-block">
                                      {result.courseCode}
                                    </span>
                                  )}
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5" />
                                    <span>
                                      {getTimeRangeDisplay(
                                        result.startTime,
                                        result.endTime
                                      )}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                  <MapPin className="h-3 w-3" />
                                  <span>{result.location}</span>
                                </div>
                              </div>
                              <div
                                className={`text-xs px-2 py-1 rounded-full ${getEventColorClasses(
                                  result.type
                                )}`}
                              >
                                {result.type.charAt(0).toUpperCase() +
                                  result.type.slice(1)}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                      <Search className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                      <p className="text-muted-foreground">
                        No results found for "{searchQuery}"
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Try adjusting your search terms
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Week View */}
          <TabsContent value="week" className="mt-2">
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-0">
                <CardTitle className="text-lg font-medium">
                  Week of{" "}
                  {currentWeekDays[0].toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  -{" "}
                  {currentWeekDays[6].toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0">
                {isMobile ? (
                  // Mobile Week View - Vertical list of days
                  <div className="divide-y">
                    {currentWeekDays.map((day, dayIndex) => {
                      const dayName = day
                        .toLocaleDateString("en-US", { weekday: "long" })
                        .toLowerCase();
                      const dayEvents = getEventsForDay(dayName);
                      const isToday = isSameDay(day, new Date());

                      return (
                        <div key={dayIndex} className="p-2">
                          <div
                            className={cn(
                              "py-2 px-3 rounded-md mb-2 font-medium flex justify-between items-center",
                              isToday ? "bg-primary/10" : "bg-muted/50"
                            )}
                          >
                            <div className="flex items-center">
                              <span className="text-sm">
                                {day.toLocaleDateString("en-US", {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                              {isToday && (
                                <span className="ml-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                                  Today
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {dayEvents.length}{" "}
                              {dayEvents.length === 1 ? "event" : "events"}
                            </span>
                          </div>

                          {dayEvents.length === 0 ? (
                            <div className="py-6 text-center text-sm text-muted-foreground">
                              No events scheduled
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {dayEvents.map((event) => (
                                <div
                                  key={event.id}
                                  className={`rounded-md p-3 ${getEventColorClasses(
                                    event.type
                                  )} cursor-pointer shadow-sm hover:shadow-md transition-shadow`}
                                >
                                  <div className="flex justify-between items-start">
                                    <div className="text-xs font-medium">
                                      {getTimeRangeDisplay(
                                        event.startTime,
                                        event.endTime
                                      )}
                                    </div>
                                    <div className="text-xs px-1.5 py-0.5 rounded-full bg-background/30">
                                      {event.type.charAt(0).toUpperCase() +
                                        event.type.slice(1)}
                                    </div>
                                  </div>
                                  <div className="font-medium mt-1">
                                    {event.title}
                                  </div>
                                  {event.courseCode && (
                                    <div className="text-xs mt-1 opacity-80">
                                      {event.courseCode}
                                    </div>
                                  )}
                                  <div className="text-xs mt-2 flex items-center">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    <span className="truncate">
                                      {event.location}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  // Desktop Week View - Grid layout
                  <>
                    {/* Days of week header */}
                    <div className="grid grid-cols-7 border-b bg-muted/50">
                      {currentWeekDays.map((day, index) => {
                        const isToday = isSameDay(day, new Date());
                        return (
                          <div
                            key={index}
                            className={`py-3 px-2 text-center ${
                              isToday ? "bg-primary/10" : ""
                            }`}
                          >
                            <div className="text-sm font-medium">
                              {day.toLocaleDateString("en-US", {
                                weekday: "short",
                              })}
                            </div>
                            <div
                              className={`text-sm mt-1 ${
                                isToday
                                  ? "bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center mx-auto"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {day.getDate()}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Schedule grid */}
                    <div className="divide-y">
                      {/* Morning time slots */}
                      <div className="py-2 px-4 flex items-center bg-muted/20">
                        <CalendarClock className="h-4 w-4 text-muted-foreground mr-2" />
                        <span className="text-sm font-medium">Morning</span>
                      </div>

                      <div className="grid grid-cols-7 divide-x">
                        {currentWeekDays.map((day, dayIndex) => {
                          const dayName = day
                            .toLocaleDateString("en-US", { weekday: "long" })
                            .toLowerCase();
                          const dayEvents = getEventsForDay(dayName).filter(
                            (event) => {
                              const hour = parseInt(
                                event.startTime.split(":")[0]
                              );
                              return hour < 12;
                            }
                          );

                          return (
                            <div
                              key={dayIndex}
                              className="min-h-[180px] p-2 space-y-2 bg-white dark:bg-background"
                            >
                              {dayEvents.length === 0 ? (
                                <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                                  No events
                                </div>
                              ) : (
                                dayEvents.map((event) => (
                                  <div
                                    key={event.id}
                                    className={`rounded-md p-2 ${getEventColorClasses(
                                      event.type
                                    )} cursor-pointer shadow-sm hover:shadow-md transition-shadow`}
                                  >
                                    <div className="text-xs font-medium">
                                      {getTimeRangeDisplay(
                                        event.startTime,
                                        event.endTime
                                      )}
                                    </div>
                                    <div className="font-medium mt-1 text-sm">
                                      {event.title}
                                    </div>
                                    <div className="text-xs mt-1 truncate">
                                      {event.location}
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Afternoon time slots */}
                      <div className="py-2 px-4 flex items-center bg-muted/20">
                        <CalendarClock className="h-4 w-4 text-muted-foreground mr-2" />
                        <span className="text-sm font-medium">Afternoon</span>
                      </div>

                      <div className="grid grid-cols-7 divide-x">
                        {currentWeekDays.map((day, dayIndex) => {
                          const dayName = day
                            .toLocaleDateString("en-US", { weekday: "long" })
                            .toLowerCase();
                          const dayEvents = getEventsForDay(dayName).filter(
                            (event) => {
                              const hour = parseInt(
                                event.startTime.split(":")[0]
                              );
                              return hour >= 12;
                            }
                          );

                          return (
                            <div
                              key={dayIndex}
                              className="min-h-[180px] p-2 space-y-2 bg-white dark:bg-background"
                            >
                              {dayEvents.length === 0 ? (
                                <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                                  No events
                                </div>
                              ) : (
                                dayEvents.map((event) => (
                                  <div
                                    key={event.id}
                                    className={`rounded-md p-2 ${getEventColorClasses(
                                      event.type
                                    )} cursor-pointer shadow-sm hover:shadow-md transition-shadow`}
                                  >
                                    <div className="text-xs font-medium">
                                      {getTimeRangeDisplay(
                                        event.startTime,
                                        event.endTime
                                      )}
                                    </div>
                                    <div className="font-medium mt-1 text-sm">
                                      {event.title}
                                    </div>
                                    <div className="text-xs mt-1 truncate">
                                      {event.location}
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Day View */}
          <TabsContent value="day" className="mt-2">
            <Card className="border-none shadow-sm">
              <CardHeader className={isMobile ? "px-4 py-3" : undefined}>
                <CardTitle className="text-lg font-medium flex justify-between items-center">
                  <span>
                    {date.toLocaleDateString("en-US", {
                      weekday: isMobile ? "short" : "long",
                      month: "long",
                      day: "numeric",
                      year: isMobile ? undefined : "numeric",
                    })}
                  </span>
                  {isMobile && (
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={goToPreviousWeek}
                        className="h-8 w-8"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={goToNextWeek}
                        className="h-8 w-8"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0">
                {(() => {
                  const dayName = date
                    .toLocaleDateString("en-US", { weekday: "long" })
                    .toLowerCase();
                  const dayEvents = getEventsForDay(dayName);

                  if (dayEvents.length === 0) {
                    return (
                      <div className="text-center py-12 px-4">
                        <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">
                          No Events Scheduled
                        </h3>
                        <p className="text-muted-foreground max-w-md mx-auto">
                          You don't have any classes or activities scheduled for
                          this day.
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="divide-y">
                      {dayEvents.map((event) => (
                        <div
                          key={event.id}
                          className="p-4 hover:bg-muted/10 transition-colors"
                        >
                          <div
                            className={
                              isMobile
                                ? "flex flex-col gap-2"
                                : "flex items-start gap-4"
                            }
                          >
                            <div
                              className={
                                isMobile
                                  ? "flex justify-between items-center"
                                  : "w-16 flex-shrink-0"
                              }
                            >
                              <div className="text-sm font-medium">
                                {formatTime(event.startTime)}
                                {isMobile
                                  ? " - " + formatTime(event.endTime)
                                  : ""}
                              </div>
                              {!isMobile && (
                                <div className="text-xs text-muted-foreground">
                                  to {formatTime(event.endTime)}
                                </div>
                              )}
                              {isMobile && (
                                <div
                                  className={`text-xs inline-block px-2 py-1 rounded-full ${getEventColorClasses(
                                    event.type
                                  )}`}
                                >
                                  {event.type.charAt(0).toUpperCase() +
                                    event.type.slice(1)}
                                </div>
                              )}
                            </div>

                            <div className="flex-1">
                              {!isMobile && (
                                <div
                                  className={`text-xs inline-block px-2 py-1 rounded-full mb-2 ${getEventColorClasses(
                                    event.type
                                  )}`}
                                >
                                  {event.type.charAt(0).toUpperCase() +
                                    event.type.slice(1)}
                                </div>
                              )}

                              <div className="flex justify-between items-start">
                                <div>
                                  <div
                                    className={
                                      isMobile
                                        ? "text-base font-medium"
                                        : "text-lg font-medium"
                                    }
                                  >
                                    {event.title}
                                  </div>
                                  {event.courseCode && (
                                    <div className="text-sm text-muted-foreground">
                                      {event.courseCode}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex flex-col space-y-1 mt-2 text-sm">
                                {event.instructor && (
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Users className="h-3.5 w-3.5" />
                                    <span>{event.instructor}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <MapPin className="h-3.5 w-3.5" />
                                  <span>{event.location}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Month View */}
          <TabsContent value="month" className="mt-2">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
              <Card className="lg:col-span-2 border-none shadow-sm">
                <CardHeader className={isMobile ? "px-4 py-3" : undefined}>
                  <CardTitle className="text-lg font-medium">
                    {date.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </CardTitle>
                </CardHeader>
                <CardContent className={isMobile ? "px-2 py-3" : undefined}>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    className="rounded-md border-none mx-auto"
                  />
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardHeader className={isMobile ? "px-4 py-3" : undefined}>
                  <CardTitle className="text-lg font-medium">
                    Upcoming Events
                  </CardTitle>
                  <CardDescription>Important dates and classes</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {filteredEvents
                      .filter((event) => event.type === "exam")
                      .map((event) => (
                        <div
                          key={event.id}
                          className="p-4 hover:bg-muted/10 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-medium mb-1">
                                {event.title}
                              </div>
                              <div className="text-xs text-muted-foreground mb-2">
                                {event.courseCode}
                              </div>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <CalendarDays className="h-3.5 w-3.5 mr-1" />
                                <span className="capitalize">
                                  {event.day},{" "}
                                  {getTimeRangeDisplay(
                                    event.startTime,
                                    event.endTime
                                  )}
                                </span>
                              </div>
                              <div className="flex items-center text-xs text-muted-foreground mt-1">
                                <MapPin className="h-3.5 w-3.5 mr-1" />
                                <span>{event.location}</span>
                              </div>
                            </div>
                            <div className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                              Exam
                            </div>
                          </div>
                        </div>
                      ))}

                    {filteredEvents.filter((event) => event.type === "exam")
                      .length === 0 && (
                      <div className="text-center py-8 px-4">
                        <GraduationCap className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
                        <p className="text-muted-foreground">
                          No upcoming exams scheduled
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

// Helper function to get days of the week for the current date
function getWeekDays(date: Date): Date[] {
  const week: Date[] = [];
  const current = new Date(date);

  // Set to beginning of the week (Sunday)
  current.setDate(current.getDate() - current.getDay());

  // Generate array of weekdays
  for (let i = 0; i < 7; i++) {
    week.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return week;
}

// Helper to check if two dates are the same day
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

// Helper to format time from 24h to 12h
function formatTime(time: string): string {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes} ${ampm}`;
}

// Helper function to get a date object for a given day of the week
function getDateForDay(day: string): Date {
  const dayMapping: Record<string, number> = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };

  const today = new Date();
  const currentDayNum = today.getDay();
  const targetDayNum = dayMapping[day.toLowerCase()];

  // Calculate days to add or subtract
  const daysToAdd = (targetDayNum - currentDayNum + 7) % 7;

  // Create new date by adding/subtracting days
  const result = new Date(today);
  result.setDate(today.getDate() + daysToAdd);
  return result;
}

export default Schedule;

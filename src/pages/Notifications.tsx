import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bell,
  CheckCheck,
  FileCheck,
  Calendar,
  AlertCircle,
  MessageSquare,
  BookOpen,
  GraduationCap,
  Filter,
  Pin,
  Archive,
  Bookmark,
  Trash2,
  ArrowRight,
  RefreshCw,
  ChevronRight,
  Settings,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

const Notifications = () => {
  const [filter, setFilter] = useState("all");
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const [showMobileFilterMenu, setShowMobileFilterMenu] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  // Sample notifications data
  const notifications = [
    {
      id: 1,
      title: "Assignment Due Tomorrow",
      message:
        'Your "Advanced Mathematics" problem set is due tomorrow at 11:59 PM.',
      time: "1 hour ago",
      read: false,
      type: "assignment",
      importance: "high",
      relatedLink: "/assignments",
      icon: FileCheck,
      course: "Advanced Mathematics",
      deadline: "Tomorrow, 11:59 PM",
      attachments: ["Problem_Set_7.pdf"],
      actions: ["View Assignment", "Request Extension"],
    },
    {
      id: 2,
      title: "Grade Posted",
      message:
        'Your grade for "World Literature Essay" has been posted. You received an A.',
      time: "3 hours ago",
      read: false,
      type: "grade",
      importance: "medium",
      relatedLink: "/grades",
      icon: GraduationCap,
      course: "World Literature",
      grade: "A (95%)",
      comments: "Excellent analysis and well-structured arguments.",
    },
    {
      id: 3,
      title: "Schedule Change",
      message:
        'Your "Physics Lab" class on Friday has been rescheduled to Monday next week.',
      time: "5 hours ago",
      read: false,
      type: "schedule",
      importance: "high",
      relatedLink: "/schedule",
      icon: Calendar,
      course: "Physics Lab",
      oldTime: "Friday, 2:00 PM - 4:00 PM",
      newTime: "Monday, 2:00 PM - 4:00 PM",
      location: "Science Building, Lab 101",
    },
    {
      id: 4,
      title: "New Message",
      message:
        "You have a new message from Professor Smith regarding your research project.",
      time: "Yesterday",
      read: true,
      type: "message",
      importance: "medium",
      relatedLink: "/messages",
      icon: MessageSquare,
      sender: "Professor Smith",
      previewText: "I wanted to discuss your latest findings on...",
    },
    {
      id: 5,
      title: "Course Materials Updated",
      message:
        'New reading materials have been added to "World History" course.',
      time: "2 days ago",
      read: true,
      type: "course",
      importance: "low",
      relatedLink: "/courses",
      icon: BookOpen,
      course: "World History",
      newMaterials: [
        "Chapter 12: Industrial Revolution",
        "Primary Sources: Factory Documents",
      ],
    },
    {
      id: 6,
      title: "Payment Reminder",
      message: "This is a reminder that your tuition payment is due next week.",
      time: "3 days ago",
      read: true,
      type: "admin",
      importance: "high",
      relatedLink: "/settings",
      icon: AlertCircle,
      dueDate: "April 30, 2023",
      amount: "$2,500",
      paymentOptions: ["Online Payment", "Bank Transfer", "Payment Plan"],
    },
    {
      id: 7,
      title: "Exam Schedule Posted",
      message: "The final exam schedule for this semester has been posted.",
      time: "1 week ago",
      read: true,
      type: "schedule",
      importance: "medium",
      relatedLink: "/schedule",
      icon: Calendar,
      examPeriod: "May 15 - May 25, 2023",
      courses: [
        "Advanced Mathematics",
        "Physics",
        "World History",
        "World Literature",
      ],
    },
  ];

  // Filter notifications based on the selected tab
  const getFilteredNotifications = () => {
    switch (filter) {
      case "unread":
        return notifications.filter((notif) => !notif.read);
      case "high-priority":
        return notifications.filter((notif) => notif.importance === "high");
      case "assignments":
        return notifications.filter((notif) => notif.type === "assignment");
      case "grades":
        return notifications.filter((notif) => notif.type === "grade");
      case "schedule":
        return notifications.filter((notif) => notif.type === "schedule");
      default:
        return notifications;
    }
  };

  const filteredNotifications = getFilteredNotifications();

  // Function to get importance styling
  const getImportanceStyles = (importance) => {
    switch (importance) {
      case "high":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      case "medium":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300";
      case "low":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const markAsRead = (id) => {
    console.log(`Marking notification ${id} as read`);
    if (unreadCount > 0) {
      setUnreadCount((prev) => prev - 1);
    }
  };

  // Function to get notification type label
  const getTypeLabel = (type) => {
    switch (type) {
      case "assignment":
        return "Assignment";
      case "grade":
        return "Grade";
      case "schedule":
        return "Schedule";
      case "message":
        return "Message";
      case "course":
        return "Course";
      case "admin":
        return "Administrative";
      default:
        return "Notification";
    }
  };

  // Function to get notification type badge color
  const getTypeBadgeClass = (type) => {
    switch (type) {
      case "assignment":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
      case "grade":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100";
      case "schedule":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100";
      case "message":
        return "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-100";
      case "course":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100";
      case "admin":
        return "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  // Function to open notification detail modal
  const openNotificationDetail = (notification) => {
    setSelectedNotification(notification);
    setShowDetailModal(true);
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const handleMarkAllAsRead = () => {
    console.log("Marking all notifications as read");
    setUnreadCount(0);
  };

  // Handle tap on notification based on device type
  const handleNotificationTap = (notification) => {
    if (isMobile) {
      openNotificationDetail(notification);
    } else {
      openNotificationDetail(notification);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="md:hidden sticky top-0 z-10 bg-background pt-2 pb-1">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold gradient-text">Notifications</h1>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setShowSettingsModal(true)}
              >
                <Settings className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={handleMarkAllAsRead}
              >
                <CheckCheck className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div
            className={`transition-all overflow-hidden ${
              showMobileFilterMenu
                ? "max-h-20 opacity-100 mt-2"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="overflow-x-auto no-scrollbar pb-2">
              <div className="flex gap-2 py-2 px-4 min-w-max">
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  size="sm"
                  className="rounded-full text-xs px-3 whitespace-nowrap"
                  onClick={() => setFilter("all")}
                >
                  All
                  {unreadCount > 0 && (
                    <span className="ml-1 bg-accent text-accent-foreground rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                      {unreadCount}
                    </span>
                  )}
                </Button>
                <Button
                  variant={filter === "unread" ? "default" : "outline"}
                  size="sm"
                  className="rounded-full text-xs px-3 whitespace-nowrap"
                  onClick={() => setFilter("unread")}
                >
                  Unread
                </Button>
                <Button
                  variant={filter === "high-priority" ? "default" : "outline"}
                  size="sm"
                  className="rounded-full text-xs px-3 whitespace-nowrap"
                  onClick={() => setFilter("high-priority")}
                >
                  High Priority
                </Button>
                <Button
                  variant={filter === "assignments" ? "default" : "outline"}
                  size="sm"
                  className="rounded-full text-xs px-3 whitespace-nowrap"
                  onClick={() => setFilter("assignments")}
                >
                  Assignments
                </Button>
                <Button
                  variant={filter === "grades" ? "default" : "outline"}
                  size="sm"
                  className="rounded-full text-xs px-3 whitespace-nowrap"
                  onClick={() => setFilter("grades")}
                >
                  Grades
                </Button>
                <Button
                  variant={filter === "schedule" ? "default" : "outline"}
                  size="sm"
                  className="rounded-full text-xs px-3 whitespace-nowrap"
                  onClick={() => setFilter("schedule")}
                >
                  Schedule
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden md:flex md:flex-row md:items-center justify-between gap-4 bg-card rounded-lg p-4 shadow-sm">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Notifications</h1>
            <p className="text-muted-foreground">
              Stay updated with important announcements and events
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setShowSettingsModal(true)}
            >
              <Filter className="h-4 w-4" />
              <span>Preferences</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </Button>
            <Button
              size="sm"
              variant="default"
              className="gap-2"
              onClick={handleMarkAllAsRead}
            >
              <CheckCheck className="h-4 w-4" />
              <span>Mark All as Read</span>
            </Button>
          </div>
        </div>

        <div className="hidden md:block">
          <Tabs defaultValue="all" onValueChange={setFilter} className="w-full">
            <div className="flex justify-between items-center mb-4">
              <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full md:w-auto md:inline-flex">
                <TabsTrigger value="all" className="relative">
                  All
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="unread">Unread</TabsTrigger>
                <TabsTrigger value="high-priority">High Priority</TabsTrigger>
                <TabsTrigger value="assignments">Assignments</TabsTrigger>
                <TabsTrigger value="grades">Grades</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
              </TabsList>
            </div>

            {/* Card layout content for desktop */}
            <TabsContent value={filter} className="mt-2">
              <div className="bg-card rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 bg-muted/30 border-b flex justify-between items-center">
                  <h3 className="font-medium flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    <span>
                      {filter === "all"
                        ? "All Notifications"
                        : `${
                            filter.charAt(0).toUpperCase() +
                            filter.slice(1).replace("-", " ")
                          } Notifications`}
                    </span>
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    {filteredNotifications.length}{" "}
                    {filteredNotifications.length === 1
                      ? "notification"
                      : "notifications"}
                  </span>
                </div>

                {filteredNotifications.length > 0 ? (
                  <ScrollArea className="h-[calc(100vh-320px)] min-h-[400px]">
                    <div className="divide-y">
                      {filteredNotifications.map((notification) => {
                        const NotificationIcon = notification.icon;
                        return (
                          <div
                            key={notification.id}
                            className={`p-4 hover:bg-muted/30 transition-colors cursor-pointer ${
                              !notification.read ? "bg-primary/5" : ""
                            }`}
                            onClick={() => openNotificationDetail(notification)}
                          >
                            <div className="flex gap-4">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getImportanceStyles(
                                  notification.importance
                                )}`}
                              >
                                <NotificationIcon className="h-5 w-5" />
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <h3
                                    className={`font-medium ${
                                      !notification.read
                                        ? "text-primary font-semibold"
                                        : ""
                                    }`}
                                  >
                                    {notification.title}
                                  </h3>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                                      {notification.time}
                                    </span>
                                    {!notification.read && (
                                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                                    )}
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                  {notification.message}
                                </p>
                                <div className="flex gap-2 mt-2">
                                  <Badge
                                    variant="outline"
                                    className={`${getTypeBadgeClass(
                                      notification.type
                                    )}`}
                                  >
                                    {getTypeLabel(notification.type)}
                                  </Badge>
                                  {notification.importance === "high" && (
                                    <Badge
                                      variant="destructive"
                                      className="inline-flex gap-1 items-center"
                                    >
                                      <AlertCircle className="h-3 w-3" />
                                      <span>Urgent</span>
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="py-16 text-center">
                    <Bell className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                    <h3 className="mt-4 text-lg font-medium">
                      No notifications found
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      You're all caught up!
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Mobile & Desktop Notification List */}
        <div className="bg-card rounded-lg shadow-sm overflow-hidden">
          <div className="p-3 bg-muted/30 border-b flex justify-between items-center">
            <h3 className="font-medium flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span>
                {filter === "all"
                  ? "All Notifications"
                  : `${
                      filter.charAt(0).toUpperCase() +
                      filter.slice(1).replace("-", " ")
                    } Notifications`}
              </span>
            </h3>
            <span className="text-sm text-muted-foreground">
              {filteredNotifications.length}{" "}
              {filteredNotifications.length === 1
                ? "notification"
                : "notifications"}
            </span>
          </div>

          {/* Always visible filter tabs - more accessible alternative */}
          <div className="md:hidden border-b">
            <div className="overflow-x-auto no-scrollbar pb-1">
              <div className="flex min-w-max">
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    filter === "all"
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setFilter("all")}
                >
                  All
                  {unreadCount > 0 && (
                    <span className="ml-1 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 inline-flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    filter === "unread"
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setFilter("unread")}
                >
                  Unread
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    filter === "high-priority"
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setFilter("high-priority")}
                >
                  High Priority
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    filter === "assignments"
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setFilter("assignments")}
                >
                  Assignments
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    filter === "grades"
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setFilter("grades")}
                >
                  Grades
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    filter === "schedule"
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setFilter("schedule")}
                >
                  Schedule
                </button>
              </div>
            </div>
          </div>

          {filteredNotifications.length > 0 ? (
            <ScrollArea className="h-[calc(100vh-230px)] md:h-[calc(100vh-320px)] min-h-[400px]">
              <div className="divide-y">
                {filteredNotifications.map((notification) => {
                  const NotificationIcon = notification.icon;
                  return (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-3 md:p-4 hover:bg-muted/30 transition-colors cursor-pointer flex",
                        !notification.read ? "bg-primary/5" : ""
                      )}
                      onClick={() => handleNotificationTap(notification)}
                    >
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                          getImportanceStyles(notification.importance)
                        )}
                      >
                        <NotificationIcon className="h-5 w-5" />
                      </div>

                      <div className="flex-1 ml-3">
                        <div className="flex justify-between items-start">
                          <h3
                            className={cn(
                              "font-medium line-clamp-1 pr-2",
                              !notification.read
                                ? "text-primary font-semibold"
                                : ""
                            )}
                          >
                            {notification.title}
                          </h3>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {notification.time}
                            </span>
                            {!notification.read && (
                              <div className="h-2 w-2 rounded-full bg-primary"></div>
                            )}
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {notification.message}
                        </p>

                        <div className="flex gap-2 mt-2 flex-wrap">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs py-0 h-5",
                              getTypeBadgeClass(notification.type)
                            )}
                          >
                            {getTypeLabel(notification.type)}
                          </Badge>
                          {notification.importance === "high" && (
                            <Badge
                              variant="destructive"
                              className="inline-flex gap-1 items-center text-xs py-0 h-5"
                            >
                              <AlertCircle className="h-3 w-3" />
                              <span>Urgent</span>
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="ml-2 self-center md:hidden">
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          ) : (
            <div className="py-16 text-center">
              <Bell className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
              <h3 className="mt-4 text-lg font-medium">
                No notifications found
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                You're all caught up!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Notification Detail - Use Drawer on mobile and Dialog on desktop */}
      {isMobile ? (
        <Drawer open={showDetailModal} onOpenChange={setShowDetailModal}>
          <DrawerContent>
            <DrawerHeader className="border-b pb-3">
              {selectedNotification && (
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      getImportanceStyles(selectedNotification.importance)
                    )}
                  >
                    <selectedNotification.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <DrawerTitle>{selectedNotification.title}</DrawerTitle>
                    <DrawerDescription className="flex justify-between items-center mt-1">
                      <Badge variant="outline">
                        {getTypeLabel(selectedNotification.type)}
                      </Badge>
                      <span className="text-xs">
                        {selectedNotification.time}
                      </span>
                    </DrawerDescription>
                  </div>
                </div>
              )}
            </DrawerHeader>

            {selectedNotification && (
              <div className="p-4 space-y-4">
                <p className="text-sm">{selectedNotification.message}</p>
                <Separator />

                {/* Dynamic content based on notification type */}
                <div className="space-y-3">
                  {selectedNotification.type === "assignment" && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Course
                        </span>
                        <span className="text-sm font-medium">
                          {selectedNotification.course}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Deadline
                        </span>
                        <span className="text-sm font-medium">
                          {selectedNotification.deadline}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Attachments
                        </span>
                        <div className="flex gap-2">
                          {selectedNotification.attachments.map(
                            (attachment, i) => (
                              <Badge
                                key={i}
                                variant="secondary"
                                className="cursor-pointer hover:bg-secondary/80"
                              >
                                {attachment}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {selectedNotification.type === "grade" && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Course
                        </span>
                        <span className="text-sm font-medium">
                          {selectedNotification.course}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Grade
                        </span>
                        <span className="text-sm font-medium">
                          {selectedNotification.grade}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground block mb-1">
                          Comments
                        </span>
                        <p className="text-sm p-2 bg-muted/50 rounded-md">
                          {selectedNotification.comments}
                        </p>
                      </div>
                    </>
                  )}

                  {selectedNotification.type === "schedule" && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Course
                        </span>
                        <span className="text-sm font-medium">
                          {selectedNotification.course}
                        </span>
                      </div>
                      {selectedNotification.oldTime && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Old Time
                          </span>
                          <span className="text-sm font-medium line-through">
                            {selectedNotification.oldTime}
                          </span>
                        </div>
                      )}
                      {selectedNotification.newTime && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            New Time
                          </span>
                          <span className="text-sm font-medium">
                            {selectedNotification.newTime}
                          </span>
                        </div>
                      )}
                      {selectedNotification.location && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Location
                          </span>
                          <span className="text-sm font-medium">
                            {selectedNotification.location}
                          </span>
                        </div>
                      )}
                      {selectedNotification.examPeriod && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Exam Period
                          </span>
                          <span className="text-sm font-medium">
                            {selectedNotification.examPeriod}
                          </span>
                        </div>
                      )}
                    </>
                  )}

                  {selectedNotification.type === "message" && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          From
                        </span>
                        <span className="text-sm font-medium">
                          {selectedNotification.sender}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground block mb-1">
                          Preview
                        </span>
                        <p className="text-sm p-2 bg-muted/50 rounded-md">
                          {selectedNotification.previewText}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            <DrawerFooter className="border-t pt-3">
              <div className="grid grid-cols-4 gap-2 mb-3">
                <Button variant="outline" size="sm" className="w-full">
                  <Bookmark className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Archive className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Check className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              {selectedNotification && (
                <Button variant="default" className="w-full" asChild>
                  <a href={selectedNotification.relatedLink}>
                    <span>View Details</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              )}
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
          <DialogContent className="sm:max-w-[525px]">
            {selectedNotification && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${getImportanceStyles(
                        selectedNotification.importance
                      )}`}
                    >
                      <selectedNotification.icon className="h-4 w-4" />
                    </div>
                    <DialogTitle>{selectedNotification.title}</DialogTitle>
                  </div>
                  <DialogDescription className="flex justify-between items-center">
                    <span>{getTypeLabel(selectedNotification.type)}</span>
                    <span className="text-xs">{selectedNotification.time}</span>
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-2 space-y-4">
                  <p className="text-sm">{selectedNotification.message}</p>

                  <Separator />

                  {/* Dynamic content based on notification type */}
                  <div className="space-y-3">
                    {selectedNotification.type === "assignment" && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Course
                          </span>
                          <span className="text-sm font-medium">
                            {selectedNotification.course}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Deadline
                          </span>
                          <span className="text-sm font-medium">
                            {selectedNotification.deadline}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Attachments
                          </span>
                          <div className="flex gap-2">
                            {selectedNotification.attachments.map(
                              (attachment, i) => (
                                <Badge
                                  key={i}
                                  variant="secondary"
                                  className="cursor-pointer hover:bg-secondary/80"
                                >
                                  {attachment}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    {selectedNotification.type === "grade" && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Course
                          </span>
                          <span className="text-sm font-medium">
                            {selectedNotification.course}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Grade
                          </span>
                          <span className="text-sm font-medium">
                            {selectedNotification.grade}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground block mb-1">
                            Comments
                          </span>
                          <p className="text-sm p-2 bg-muted/50 rounded-md">
                            {selectedNotification.comments}
                          </p>
                        </div>
                      </>
                    )}

                    {selectedNotification.type === "schedule" && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Course
                          </span>
                          <span className="text-sm font-medium">
                            {selectedNotification.course}
                          </span>
                        </div>
                        {selectedNotification.oldTime && (
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                              Old Time
                            </span>
                            <span className="text-sm font-medium line-through">
                              {selectedNotification.oldTime}
                            </span>
                          </div>
                        )}
                        {selectedNotification.newTime && (
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                              New Time
                            </span>
                            <span className="text-sm font-medium">
                              {selectedNotification.newTime}
                            </span>
                          </div>
                        )}
                        {selectedNotification.location && (
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                              Location
                            </span>
                            <span className="text-sm font-medium">
                              {selectedNotification.location}
                            </span>
                          </div>
                        )}
                        {selectedNotification.examPeriod && (
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                              Exam Period
                            </span>
                            <span className="text-sm font-medium">
                              {selectedNotification.examPeriod}
                            </span>
                          </div>
                        )}
                      </>
                    )}

                    {selectedNotification.type === "message" && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            From
                          </span>
                          <span className="text-sm font-medium">
                            {selectedNotification.sender}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground block mb-1">
                            Preview
                          </span>
                          <p className="text-sm p-2 bg-muted/50 rounded-md">
                            {selectedNotification.previewText}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <DialogFooter className="flex sm:justify-between gap-2 flex-wrap">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Bookmark className="h-4 w-4" />
                      <span className="hidden sm:inline">Save</span>
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Archive className="h-4 w-4" />
                      <span className="hidden sm:inline">Archive</span>
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Trash2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Delete</span>
                    </Button>
                  </div>
                  <Button variant="default" className="gap-1" asChild>
                    <a href={selectedNotification.relatedLink}>
                      <span>View Details</span>
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      )}

      {/* Settings Modal - Use drawer on mobile */}
      {isMobile ? (
        <Drawer open={showSettingsModal} onOpenChange={setShowSettingsModal}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Notification Preferences</DrawerTitle>
              <DrawerDescription>
                Customize how you receive notifications
              </DrawerDescription>
            </DrawerHeader>

            <div className="px-4 py-2 space-y-4">
              <h3 className="font-medium text-sm">Notification Types</h3>
              <div className="grid gap-3">
                {[
                  "assignment",
                  "grade",
                  "schedule",
                  "message",
                  "course",
                  "admin",
                ].map((type) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${getTypeBadgeClass(
                          type
                        )}`}
                      >
                        {type === "assignment" && (
                          <FileCheck className="h-4 w-4" />
                        )}
                        {type === "grade" && (
                          <GraduationCap className="h-4 w-4" />
                        )}
                        {type === "schedule" && (
                          <Calendar className="h-4 w-4" />
                        )}
                        {type === "message" && (
                          <MessageSquare className="h-4 w-4" />
                        )}
                        {type === "course" && <BookOpen className="h-4 w-4" />}
                        {type === "admin" && (
                          <AlertCircle className="h-4 w-4" />
                        )}
                      </div>
                      <span className="text-sm capitalize">
                        {getTypeLabel(type)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 w-7 p-0"
                      >
                        <Bell className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 w-7 p-0"
                      >
                        <Pin className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="my-2" />

            <div className="px-4 py-2">
              <h3 className="font-medium text-sm mb-3">Delivery Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label htmlFor="email" className="text-sm">
                    Email Notifications
                  </label>
                  <input
                    type="checkbox"
                    id="email"
                    defaultChecked
                    className="h-4 w-4"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="push" className="text-sm">
                    Push Notifications
                  </label>
                  <input
                    type="checkbox"
                    id="push"
                    defaultChecked
                    className="h-4 w-4"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="sound" className="text-sm">
                    Sound Alerts
                  </label>
                  <input type="checkbox" id="sound" className="h-4 w-4" />
                </div>
              </div>
            </div>

            <DrawerFooter>
              <Button variant="outline">Reset to Default</Button>
              <Button>Save Preferences</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={showSettingsModal} onOpenChange={setShowSettingsModal}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Notification Preferences</DialogTitle>
              <DialogDescription>
                Customize how you receive notifications
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-4">
              <h3 className="font-medium text-sm">Notification Types</h3>
              <div className="grid gap-3">
                {[
                  "assignment",
                  "grade",
                  "schedule",
                  "message",
                  "course",
                  "admin",
                ].map((type) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${getTypeBadgeClass(
                          type
                        )}`}
                      >
                        {type === "assignment" && (
                          <FileCheck className="h-4 w-4" />
                        )}
                        {type === "grade" && (
                          <GraduationCap className="h-4 w-4" />
                        )}
                        {type === "schedule" && (
                          <Calendar className="h-4 w-4" />
                        )}
                        {type === "message" && (
                          <MessageSquare className="h-4 w-4" />
                        )}
                        {type === "course" && <BookOpen className="h-4 w-4" />}
                        {type === "admin" && (
                          <AlertCircle className="h-4 w-4" />
                        )}
                      </div>
                      <span className="text-sm capitalize">
                        {getTypeLabel(type)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 w-7 p-0"
                      >
                        <Bell className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 w-7 p-0"
                      >
                        <Pin className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="py-2">
              <h3 className="font-medium text-sm mb-3">Delivery Preferences</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="email" defaultChecked />
                  <label htmlFor="email" className="text-sm">
                    Email Notifications
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="push" defaultChecked />
                  <label htmlFor="push" className="text-sm">
                    Push Notifications
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="sound" />
                  <label htmlFor="sound" className="text-sm">
                    Sound Alerts
                  </label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline">Reset to Default</Button>
              <Button>Save Preferences</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
};

export default Notifications;

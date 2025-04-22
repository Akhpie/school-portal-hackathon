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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Heart,
  BookOpen,
  Headphones,
  CalendarDays,
  Phone,
  MessageCircle,
  ArrowRight,
  Heart as HeartIcon,
  BarChart2,
  Coffee,
  Moon,
  Timer,
  Users,
  MapPin,
  CheckCircle2,
  Star,
  Lightbulb,
  ArrowUpRight,
  Menu,
  Clock,
  Bell,
  Bookmark,
  Sparkles,
  BookmarkCheck,
  X,
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// Define resource type for better type safety
interface Resource {
  title: string;
  description: string;
  icon: any;
  link: string;
  category: string;
  color: string;
}

const Wellness = () => {
  const [showAppointmentDialog, setShowAppointmentDialog] = useState(false);
  const [showBookmarksDialog, setShowBookmarksDialog] = useState(false);
  const [moodLog, setMoodLog] = useState<number | null>(null);
  const [activeResource, setActiveResource] = useState<Resource | null>(null);
  const [bookmarkedResources, setBookmarkedResources] = useState<string[]>([]);
  const [moodData] = useState([70, 40, 60, 85, 55, 75, 65]);
  const [todaysMood, setTodaysMood] = useState<string | null>(null);
  const [selfCareProgress, setSelfCareProgress] = useState({
    mindfulness: 65,
    exercise: 45,
    sleep: 75,
    nutrition: 60,
  });

  // Add dialog state controls
  const [showMindfulnessDialog, setShowMindfulnessDialog] = useState(false);
  const [showExerciseDialog, setShowExerciseDialog] = useState(false);
  const [showSleepDialog, setShowSleepDialog] = useState(false);
  const [showNutritionDialog, setShowNutritionDialog] = useState(false);

  // Load bookmarks from local storage on component mount
  useEffect(() => {
    const storedBookmarks = localStorage.getItem("wellnessBookmarks");
    if (storedBookmarks) {
      try {
        setBookmarkedResources(JSON.parse(storedBookmarks));
      } catch (e) {
        console.error("Error parsing bookmarks:", e);
      }
    }
  }, []);

  // Save bookmarks to local storage whenever they change
  useEffect(() => {
    localStorage.setItem(
      "wellnessBookmarks",
      JSON.stringify(bookmarkedResources)
    );
  }, [bookmarkedResources]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Your request has been submitted successfully", {
      description: "A wellness counselor will contact you within 24 hours",
    });
  };

  const handleMoodSelect = (value: number) => {
    setMoodLog(value);
    toast.success("Mood logged successfully", {
      description: "Your daily mood log has been recorded",
    });
  };

  const handleResourceOpen = (resource: Resource) => {
    setActiveResource(resource);
  };

  const handleAppointmentRequest = () => {
    setShowAppointmentDialog(false);
    toast.success("Appointment requested", {
      description: "You will receive a confirmation email shortly",
    });
  };

  const toggleBookmark = (resourceTitle: string) => {
    setBookmarkedResources((prev) => {
      if (prev.includes(resourceTitle)) {
        toast.success("Bookmark removed", {
          description: `${resourceTitle} removed from your saved resources`,
        });
        return prev.filter((title) => title !== resourceTitle);
      } else {
        toast.success("Resource bookmarked", {
          description: `${resourceTitle} added to your saved resources`,
        });
        return [...prev, resourceTitle];
      }
    });
  };

  // Filter resources based on bookmarks
  const getBookmarkedResources = (resources: Resource[]) => {
    return resources.filter((resource) =>
      bookmarkedResources.includes(resource.title)
    );
  };

  // Resources data
  const resourcesData: Resource[] = [
    {
      title: "Stress Management Guide",
      description:
        "Learn effective techniques to manage academic stress and anxiety",
      icon: BookOpen,
      link: "#",
      category: "Guide",
      color: "blue",
    },
    {
      title: "Mindfulness Meditation",
      description:
        "Audio sessions for daily meditation practice to improve focus",
      icon: Headphones,
      link: "#",
      category: "Audio",
      color: "purple",
    },
    {
      title: "Healthy Sleep Habits",
      description: "Tips for improving sleep quality and establishing routines",
      icon: Moon,
      link: "#",
      category: "Guide",
      color: "indigo",
    },
    {
      title: "Time Management Strategies",
      description:
        "Methods to balance academics, activities, and personal time",
      icon: Timer,
      link: "#",
      category: "Workshop",
      color: "green",
    },
    {
      title: "Peer Support Network",
      description:
        "Connect with fellow students trained in supportive listening",
      icon: MessageCircle,
      link: "#",
      category: "Service",
      color: "pink",
    },
    {
      title: "Nutrition for Mental Health",
      description: "How diet affects mood, focus, and overall wellbeing",
      icon: Coffee,
      link: "#",
      category: "Guide",
      color: "amber",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/20 via-primary/10 to-background p-8 shadow-lg">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-3/5 space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold">
                Your Mental Wellness Journey
              </h1>
              <p className="text-lg text-muted-foreground">
                Take care of your mind with personalized resources, support, and
                tools designed for students
              </p>
              <div className="flex flex-wrap gap-3 mt-2">
                <Button
                  className="gap-2"
                  onClick={() => setShowAppointmentDialog(true)}
                >
                  <Headphones className="h-4 w-4" />
                  <span>Get Support Now</span>
                </Button>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => {
                    document.getElementById("resources-tab")?.click();
                    toast.success("Resources loaded", {
                      description: "Explore our curated wellness resources",
                    });
                  }}
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Explore Resources</span>
                </Button>
              </div>
            </div>
            <div className="md:w-2/5 flex justify-center">
              <div className="relative">
                <div className="h-40 w-40 rounded-full bg-primary/30 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                <div className="h-64 w-64 rounded-full bg-primary/20 animate-pulse" />
                <div className="absolute top-0 left-0">
                  <div className="p-2 rounded-full bg-white shadow-lg dark:bg-slate-800">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <div className="absolute bottom-4 right-4">
                  <div className="p-2 rounded-full bg-white shadow-lg dark:bg-slate-800">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Mood Tracker */}
        <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-b from-background to-muted/20">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <HeartIcon className="h-5 w-5 text-primary" />
                  How are you feeling today?
                </CardTitle>
                <CardDescription>
                  Track your mood to improve self-awareness
                </CardDescription>
              </div>
              <Badge variant="outline" className="px-2 py-1">
                <Clock className="h-3 w-3 mr-1" />
                <span>Daily Check-in</span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap justify-center gap-4 py-2">
              {[
                { value: 1, emoji: "😔", label: "Struggling" },
                { value: 2, emoji: "😕", label: "Down" },
                { value: 3, emoji: "😐", label: "Neutral" },
                { value: 4, emoji: "🙂", label: "Good" },
                { value: 5, emoji: "😁", label: "Excellent" },
              ].map((mood) => (
                <div
                  key={mood.value}
                  onClick={() => handleMoodSelect(mood.value)}
                  className={`flex flex-col items-center p-4 rounded-lg cursor-pointer transition-all
                    ${
                      moodLog === mood.value
                        ? "bg-primary/20 scale-110"
                        : "hover:bg-primary/10"
                    }`}
                >
                  <div className="text-4xl mb-2">{mood.emoji}</div>
                  <span className="text-sm font-medium">{mood.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="pt-0 pb-4 px-4">
            <div className="w-full bg-slate-900 dark:bg-slate-800 text-white rounded-lg p-4">
              <div className="text-sm mb-3 font-medium">
                Your mood over the past week:
              </div>
              <div className="flex justify-between h-[120px] mb-2 relative">
                {moodData.map((value, i) => (
                  <div
                    key={i}
                    className="group flex flex-col items-center justify-end w-10"
                  >
                    <div className="text-sm text-center mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {value}%
                    </div>
                    <div
                      className="w-6 rounded-t-md bg-gradient-to-t from-blue-600 to-blue-400"
                      style={{ height: `${Math.max(10, value * 0.9)}px` }}
                    ></div>
                    <div className="mt-2 text-xs text-slate-400">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                    </div>
                  </div>
                ))}

                {/* Horizontal guidelines */}
                <div className="absolute left-0 right-0 bottom-[25%] border-t border-dashed border-slate-700 h-0" />
                <div className="absolute left-0 right-0 bottom-[50%] border-t border-dashed border-slate-700 h-0" />
                <div className="absolute left-0 right-0 bottom-[75%] border-t border-dashed border-slate-700 h-0" />
              </div>

              <div className="flex justify-between text-xs text-slate-500 mt-4">
                <div>Low</div>
                <div>Mood Intensity</div>
                <div>High</div>
              </div>
            </div>
          </CardFooter>
        </Card>

        {/* Wellness Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 overflow-hidden border-t-4 border-primary/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-primary" />
                Personal Wellness Dashboard
              </CardTitle>
              <CardDescription>
                Track and improve your self-care activities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm">Mindfulness</h3>
                    <span className="text-xs text-muted-foreground">
                      {selfCareProgress.mindfulness}%
                    </span>
                  </div>
                  <Progress
                    value={selfCareProgress.mindfulness}
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    {selfCareProgress.mindfulness < 30
                      ? "Try meditation to improve your mindfulness score."
                      : selfCareProgress.mindfulness < 70
                      ? "You're doing well! Continue your mindfulness practice."
                      : "Excellent mindfulness habits! Keep it up!"}
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowMindfulnessDialog(true)}
                >
                  Practice Mindfulness
                </Button>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm">Physical Activity</h3>
                    <span className="text-xs text-muted-foreground">
                      {selfCareProgress.exercise}%
                    </span>
                  </div>
                  <Progress value={selfCareProgress.exercise} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {selfCareProgress.exercise < 30
                      ? "Try to incorporate more movement in your day."
                      : selfCareProgress.exercise < 70
                      ? "You're on the right track with your physical activity."
                      : "Great job staying active!"}
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowExerciseDialog(true)}
                >
                  Log Exercise
                </Button>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm">Sleep Quality</h3>
                    <span className="text-xs text-muted-foreground">
                      {selfCareProgress.sleep}%
                    </span>
                  </div>
                  <Progress value={selfCareProgress.sleep} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {selfCareProgress.sleep < 30
                      ? "Your sleep patterns need improvement. Try a consistent schedule."
                      : selfCareProgress.sleep < 70
                      ? "Your sleep is improving. Keep maintaining regular hours."
                      : "Excellent sleep habits! You're getting quality rest."}
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowSleepDialog(true)}
                >
                  Track Sleep
                </Button>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm">Nutrition</h3>
                    <span className="text-xs text-muted-foreground">
                      {selfCareProgress.nutrition}%
                    </span>
                  </div>
                  <Progress
                    value={selfCareProgress.nutrition}
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    {selfCareProgress.nutrition < 30
                      ? "Try to include more balanced meals in your diet."
                      : selfCareProgress.nutrition < 70
                      ? "You're making good food choices. Keep it up!"
                      : "Excellent nutrition habits! Your body thanks you."}
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowNutritionDialog(true)}
                >
                  Log Nutrition
                </Button>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button className="w-full group">
                <span>View Detailed Wellness Report</span>
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Need Support?</CardTitle>
              <CardDescription>
                Reach out to our counseling team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="support-type">
                    How can we help you?
                  </label>
                  <select
                    id="support-type"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="counseling">
                      Request Counseling Session
                    </option>
                    <option value="resources">Access Wellness Resources</option>
                    <option value="emergency">Urgent Support</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="message">
                    Brief description
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Tell us how we can help..."
                    className="min-h-[120px]"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Submit Request
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col items-start space-y-2 pt-0">
              <p className="text-sm text-muted-foreground">
                For immediate assistance, contact:
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-3.5 w-3.5 text-primary" />
                <span>(123) 456-7890</span>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Resource Appointment Dialog */}
        <Dialog
          open={showAppointmentDialog}
          onOpenChange={setShowAppointmentDialog}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Schedule a Wellness Appointment</DialogTitle>
              <DialogDescription>
                Request a session with one of our wellness counselors
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Appointment Type</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <option value="individual">Individual Counseling</option>
                  <option value="group">Group Support</option>
                  <option value="wellness">Wellness Coaching</option>
                  <option value="crisis">Crisis Support</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Preferred Date</label>
                <div className="grid grid-cols-3 gap-2">
                  {["Today", "Tomorrow", "Choose Date"].map((date, i) => (
                    <Button
                      key={i}
                      variant={i === 0 ? "default" : "outline"}
                      className="w-full"
                    >
                      {date}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Preferred Time</label>
                <div className="grid grid-cols-2 gap-2">
                  {["Morning", "Afternoon"].map((time, i) => (
                    <Button
                      key={i}
                      variant={i === 0 ? "default" : "outline"}
                      className="w-full"
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Additional Notes</label>
                <Textarea
                  placeholder="Tell us more about what you'd like to discuss..."
                  className="min-h-[80px]"
                />
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                className="sm:w-1/2"
                onClick={() => setShowAppointmentDialog(false)}
              >
                Cancel
              </Button>
              <Button className="sm:w-1/2" onClick={handleAppointmentRequest}>
                Request Appointment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Tabs defaultValue="resources" className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-6">
            <TabsTrigger
              id="resources-tab"
              value="resources"
              className="flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              <span>Resources</span>
            </TabsTrigger>
            <TabsTrigger value="counseling" className="flex items-center gap-2">
              <Headphones className="h-4 w-4" />
              <span>Counseling</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <span>Events</span>
            </TabsTrigger>
          </TabsList>

          {/* Resource View Dialog */}
          <Dialog
            open={activeResource !== null}
            onOpenChange={(open) => !open && setActiveResource(null)}
          >
            {activeResource && (
              <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        activeResource.color === "blue"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                          : activeResource.color === "purple"
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                          : activeResource.color === "indigo"
                          ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
                          : activeResource.color === "green"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                          : activeResource.color === "pink"
                          ? "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300"
                          : activeResource.color === "amber"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      <activeResource.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <DialogTitle className="text-xl">
                        {activeResource.title}
                      </DialogTitle>
                      <DialogDescription>
                        <Badge variant="outline" className="mt-1">
                          {activeResource.category}
                        </Badge>
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
                <div className="py-6">
                  <p className="mb-4">{activeResource.description}</p>

                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="text-lg font-medium mb-2">Key Benefits</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>
                            Improve your mental wellbeing and resilience
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>
                            Develop practical skills for managing stress
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>
                            Evidence-based techniques from wellness experts
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-3">
                        <h4 className="font-medium mb-1 flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>Duration</span>
                        </h4>
                        <p className="text-sm">30-60 minutes per session</p>
                      </div>
                      <div className="border rounded-lg p-3">
                        <h4 className="font-medium mb-1 flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>Format</span>
                        </h4>
                        <p className="text-sm">
                          Self-guided with downloadable resources
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter className="gap-2 flex-col sm:flex-row">
                  <Button
                    variant="outline"
                    className="sm:flex-1"
                    onClick={() => {
                      toast.success(`Bookmarked ${activeResource.title}`, {
                        description: "Saved to your resources for easy access",
                      });
                    }}
                  >
                    <Bookmark className="mr-2 h-4 w-4" />
                    Save Resource
                  </Button>
                  <Button
                    className="sm:flex-1"
                    onClick={() => {
                      toast.success(`Accessing ${activeResource.title}`, {
                        description: "Opening full resource content...",
                      });
                      setActiveResource(null);
                    }}
                  >
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Access Now
                  </Button>
                </DialogFooter>
              </DialogContent>
            )}
          </Dialog>

          <TabsContent value="resources">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium">Wellness Resources</h2>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setShowBookmarksDialog(true)}
              >
                <BookmarkCheck className="h-4 w-4" />
                <span>Saved Resources</span>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resourcesData.map((resource, i) => (
                <Card
                  key={i}
                  className="overflow-hidden dark:bg-slate-900 group hover:shadow-lg transition-all duration-300 border-t-0"
                >
                  <div
                    className={`h-2 w-full ${
                      resource.color === "blue"
                        ? "bg-blue-500"
                        : resource.color === "purple"
                        ? "bg-purple-500"
                        : resource.color === "indigo"
                        ? "bg-indigo-500"
                        : resource.color === "green"
                        ? "bg-green-500"
                        : resource.color === "pink"
                        ? "bg-pink-500"
                        : resource.color === "amber"
                        ? "bg-amber-500"
                        : "bg-primary"
                    }`}
                  />
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div
                          className={`text-xs font-medium px-2 py-1 rounded-full w-fit mb-2 ${
                            resource.color === "blue"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                              : resource.color === "purple"
                              ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                              : resource.color === "indigo"
                              ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
                              : resource.color === "green"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                              : resource.color === "pink"
                              ? "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300"
                              : resource.color === "amber"
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          {resource.category}
                        </div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {resource.title}
                        </CardTitle>
                      </div>
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          resource.color === "blue"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                            : resource.color === "purple"
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                            : resource.color === "indigo"
                            ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
                            : resource.color === "green"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                            : resource.color === "pink"
                            ? "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300"
                            : resource.color === "amber"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        <resource.icon className="h-5 w-5" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {resource.description}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0 pb-4 flex justify-between items-center">
                    <Button
                      variant="default"
                      size="sm"
                      className={`gap-2 ${
                        resource.color === "blue"
                          ? "bg-blue-500 hover:bg-blue-600"
                          : resource.color === "purple"
                          ? "bg-purple-500 hover:bg-purple-600"
                          : resource.color === "indigo"
                          ? "bg-indigo-500 hover:bg-indigo-600"
                          : resource.color === "green"
                          ? "bg-green-500 hover:bg-green-600"
                          : resource.color === "pink"
                          ? "bg-pink-500 hover:bg-pink-600"
                          : resource.color === "amber"
                          ? "bg-amber-500 hover:bg-amber-600"
                          : ""
                      }`}
                      onClick={() => {
                        toast.success(`Accessing ${resource.title}`, {
                          description: `Loading ${resource.category.toLowerCase()} content...`,
                        });
                        // Set active resource for a future detailed view if needed
                        handleResourceOpen(resource);
                      }}
                    >
                      Access Resource
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={
                        bookmarkedResources.includes(resource.title)
                          ? "default"
                          : "ghost"
                      }
                      size="icon"
                      className={
                        bookmarkedResources.includes(resource.title)
                          ? "bg-primary/10 text-primary"
                          : ""
                      }
                      onClick={() => {
                        toggleBookmark(resource.title);
                      }}
                    >
                      {bookmarkedResources.includes(resource.title) ? (
                        <BookmarkCheck className="h-4 w-4" />
                      ) : (
                        <Bookmark className="h-4 w-4" />
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="counseling">
            <Card>
              <CardHeader>
                <CardTitle>Counseling Services</CardTitle>
                <CardDescription>
                  Our school offers a variety of counseling services to support
                  your mental health needs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Headphones className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg mb-1">
                          Individual Counseling
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          One-on-one sessions with our licensed counselors to
                          discuss personal challenges, stress, anxiety, or any
                          other concerns affecting your wellbeing.
                        </p>
                        <Button
                          variant="link"
                          className="p-0 h-auto mt-2 text-primary"
                        >
                          Schedule a Session
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg mb-1">
                          Group Support
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Join peer-led or counselor-facilitated group sessions
                          focused on specific topics such as stress management,
                          social anxiety, or academic pressure.
                        </p>
                        <Button
                          variant="link"
                          className="p-0 h-auto mt-2 text-primary"
                        >
                          Browse Groups
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg mb-1">
                          Wellness Workshops
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Educational sessions on various aspects of mental
                          health, emotional intelligence, and developing healthy
                          coping mechanisms.
                        </p>
                        <Button
                          variant="link"
                          className="p-0 h-auto mt-2 text-primary"
                        >
                          View Schedule
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg mb-1">
                          Crisis Support
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Immediate assistance for urgent mental health
                          concerns, available 24/7 through our crisis hotline
                          and online chat support.
                        </p>
                        <Button
                          variant="link"
                          className="p-0 h-auto mt-2 text-primary"
                        >
                          Access Emergency Support
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 border rounded-xl bg-secondary/40">
                  <h3 className="font-medium text-lg mb-3">
                    Meet Our Counseling Team
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                      {
                        name: "Dr. Sarah Johnson",
                        role: "Lead Counselor",
                        image:
                          "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
                      },
                      {
                        name: "Michael Chen",
                        role: "Student Support",
                        image:
                          "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
                      },
                      {
                        name: "Dr. James Wilson",
                        role: "Psychologist",
                        image:
                          "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
                      },
                      {
                        name: "Emily Rodriguez",
                        role: "Wellness Coach",
                        image:
                          "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
                      },
                    ].map((counselor, i) => (
                      <div key={i} className="text-center">
                        <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-3 border-2 border-background">
                          <img
                            src={counselor.image}
                            alt={counselor.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="font-medium">{counselor.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {counselor.role}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  Book a Counseling Appointment
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Wellness Events & Activities</CardTitle>
                <CardDescription>
                  Upcoming events focused on mental health and wellbeing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    {
                      title: "Stress Management Workshop",
                      date: "April 20, 2025",
                      time: "3:00 PM - 4:30 PM",
                      location: "Student Center, Room 202",
                      description:
                        "Learn practical techniques to manage academic stress and anxiety during exam season.",
                      category: "Workshop",
                    },
                    {
                      title: "Mindfulness Meditation Session",
                      date: "April 23, 2025",
                      time: "12:15 PM - 12:45 PM",
                      location: "Wellness Room, East Building",
                      description:
                        "A guided meditation session to help center your thoughts and improve focus.",
                      category: "Practice",
                    },
                    {
                      title: "Mental Health Awareness Fair",
                      date: "April 28, 2025",
                      time: "11:00 AM - 3:00 PM",
                      location: "Main Quad",
                      description:
                        "Join us for resources, activities, and conversations about mental health and wellness.",
                      category: "Event",
                    },
                    {
                      title: "Sleep and Academic Performance Talk",
                      date: "May 5, 2025",
                      time: "4:00 PM - 5:00 PM",
                      location: "Lecture Hall 101",
                      description:
                        "Dr. Lisa Moreno discusses the vital connection between sleep quality and academic success.",
                      category: "Lecture",
                    },
                  ].map((event, i) => (
                    <div
                      key={i}
                      className="flex flex-col md:flex-row gap-4 pb-6 last:pb-0 last:border-0 border-b"
                    >
                      <div className="md:w-1/3 flex flex-col">
                        <div className="text-xs font-medium mb-2 px-2 py-1 rounded-full bg-primary/10 text-primary w-fit">
                          {event.category}
                        </div>
                        <h3 className="font-medium text-lg">{event.title}</h3>
                        <div className="flex flex-col mt-2 text-sm space-y-1">
                          <div className="flex items-center gap-2">
                            <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {event.date}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Timer className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {event.time}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {event.location}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="md:w-2/3">
                        <p className="text-muted-foreground mb-4">
                          {event.description}
                        </p>
                        <div className="flex gap-3">
                          <Button size="sm" variant="outline">
                            More Details
                          </Button>
                          <Button size="sm">Register</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">View All Events</Button>
                <Button variant="outline">Add to Calendar</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Bookmarks Dialog */}
        <Dialog
          open={showBookmarksDialog}
          onOpenChange={setShowBookmarksDialog}
        >
          <DialogContent className="sm:max-w-[650px]">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <BookmarkCheck className="h-5 w-5 text-primary" />
                Saved Wellness Resources
              </DialogTitle>
              <DialogDescription>
                Quick access to your bookmarked wellness resources
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              {bookmarkedResources.length > 0 ? (
                <div className="space-y-4">
                  {getBookmarkedResources(resourcesData).map((resource, i) => (
                    <Card key={i} className="overflow-hidden">
                      <div className="flex items-center p-3 gap-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            resource.color === "blue"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                              : resource.color === "purple"
                              ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                              : resource.color === "indigo"
                              ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
                              : resource.color === "green"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                              : resource.color === "pink"
                              ? "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300"
                              : resource.color === "amber"
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          <resource.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{resource.title}</h3>
                          <div className="text-xs text-muted-foreground">
                            {resource.category} •{" "}
                            {resource.description
                              .split(" ")
                              .slice(0, 5)
                              .join(" ")}
                            ...
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8"
                            onClick={() => {
                              handleResourceOpen(resource);
                              setShowBookmarksDialog(false);
                            }}
                          >
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => toggleBookmark(resource.title)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                    <Bookmark className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium text-lg mb-2">
                    No bookmarked resources
                  </h3>
                  <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                    Save resources by clicking the bookmark icon to add them to
                    your collection for easy access
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowBookmarksDialog(false);
                      document.getElementById("resources-tab")?.click();
                    }}
                  >
                    Browse Resources
                  </Button>
                </div>
              )}
            </div>

            {bookmarkedResources.length > 0 && (
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setBookmarkedResources([]);
                    toast.success("Bookmarks cleared", {
                      description: "All saved resources have been removed",
                    });
                  }}
                >
                  Clear All Bookmarks
                </Button>
                <Button onClick={() => setShowBookmarksDialog(false)}>
                  Close
                </Button>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Wellness;

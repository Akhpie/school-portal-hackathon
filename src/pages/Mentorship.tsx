import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  UserRound,
  Mail,
  Calendar,
  Clock,
  MessageCircle,
  Globe,
  Search,
  Briefcase,
  School,
  ChevronRight,
  Star,
  Filter,
  BookOpen,
  Users,
  GraduationCap,
  Award,
  ArrowRight,
  CheckCircle2,
  Tags,
  MessageSquare,
  Video,
  CheckCheck,
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";

// Types for mentors and sessions
interface Mentor {
  id: string;
  name: string;
  avatar: string;
  title: string;
  company: string;
  expertise: string[];
  bio: string;
  availability: string[];
  rating: number;
  totalSessions: number;
  education: string;
  yearOfExperience: number;
  isAvailable: boolean;
}

interface MentorshipSession {
  id: string;
  mentorId: string;
  studentId: string;
  date: string;
  time: string;
  status: "scheduled" | "completed" | "canceled";
  topic: string;
  notes?: string;
  feedback?: string;
  rating?: number;
}

const Mentorship = () => {
  const { currentUser } = useApp();
  const [activeTab, setActiveTab] = useState("explore");
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [sessions, setSessions] = useState<MentorshipSession[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [showMentorDetails, setShowMentorDetails] = useState(false);
  const [showBookSession, setShowBookSession] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [sessionTopic, setSessionTopic] = useState<string>("");
  const [sessionNotes, setSessionNotes] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExpertise, setSelectedExpertise] = useState<string>("all");

  // Sample mentors data
  const sampleMentors: Mentor[] = [
    {
      id: "1",
      name: "Dr. Michael Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      title: "Software Engineer",
      company: "TechNova Solutions",
      expertise: ["Computer Science", "Programming", "AI/ML"],
      bio: "Experienced software engineer with a PhD in Computer Science. Passionate about mentoring students interested in software development, artificial intelligence, and computer science research.",
      availability: ["Monday", "Wednesday", "Friday"],
      rating: 4.8,
      totalSessions: 45,
      education: "PhD in Computer Science, Stanford University",
      yearOfExperience: 12,
      isAvailable: true,
    },
    {
      id: "2",
      name: "Sarah Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      title: "UX/UI Designer",
      company: "CreativeMinds Agency",
      expertise: ["Design", "User Experience", "Product Design"],
      bio: "Design leader with a background in psychology and human-computer interaction. I help students navigate the world of user experience design and build portfolios that stand out to employers.",
      availability: ["Tuesday", "Thursday", "Saturday"],
      rating: 4.9,
      totalSessions: 38,
      education: "MFA in Design, Rhode Island School of Design",
      yearOfExperience: 8,
      isAvailable: true,
    },
    {
      id: "3",
      name: "Dr. James Wilson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
      title: "Research Scientist",
      company: "BioTech Innovations",
      expertise: ["Biology", "Chemistry", "Research Methodology"],
      bio: "Research scientist specializing in molecular biology. I mentor students interested in scientific research, laboratory techniques, and academic career paths in the sciences.",
      availability: ["Monday", "Wednesday", "Friday"],
      rating: 4.7,
      totalSessions: 27,
      education: "PhD in Molecular Biology, Harvard University",
      yearOfExperience: 15,
      isAvailable: true,
    },
    {
      id: "4",
      name: "Emily Rodriguez",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
      title: "Marketing Director",
      company: "GlobalBrand Enterprises",
      expertise: ["Marketing", "Communications", "Social Media"],
      bio: "Marketing professional with experience across digital and traditional channels. I help students develop marketing skills, understand consumer behavior, and prepare for careers in the field.",
      availability: ["Tuesday", "Thursday", "Saturday"],
      rating: 4.6,
      totalSessions: 19,
      education: "MBA, Northwestern University",
      yearOfExperience: 10,
      isAvailable: false,
    },
    {
      id: "5",
      name: "Robert Kim",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
      title: "Financial Analyst",
      company: "Pinnacle Investments",
      expertise: ["Finance", "Economics", "Business"],
      bio: "Financial analyst with experience in investment banking and corporate finance. I mentor students interested in finance careers, from investment management to financial analysis.",
      availability: ["Monday", "Wednesday", "Sunday"],
      rating: 4.5,
      totalSessions: 22,
      education: "MS in Finance, University of Chicago",
      yearOfExperience: 9,
      isAvailable: true,
    },
  ];

  // Sample mentorship sessions
  const sampleSessions: MentorshipSession[] = [
    {
      id: "1",
      mentorId: "1",
      studentId: "1",
      date: "2025-04-15",
      time: "15:00",
      status: "scheduled",
      topic: "Career guidance in software development",
      notes: "Discuss internship opportunities and portfolio development",
    },
    {
      id: "2",
      mentorId: "2",
      studentId: "1",
      date: "2025-04-01",
      time: "14:00",
      status: "completed",
      topic: "Design portfolio review",
      notes: "Review portfolio projects and get feedback",
      feedback:
        "Sarah provided excellent feedback on my portfolio design and suggested improvements for my project presentations.",
      rating: 5,
    },
  ];

  // Initialize data on component mount
  useEffect(() => {
    // Set sample data
    setMentors(sampleMentors);
    setSessions(sampleSessions);

    // In a real app, you would fetch data from your API or database
  }, []);

  // Filter mentors based on search and expertise
  const filteredMentors = () => {
    return mentors.filter((mentor) => {
      // Search term filter
      const matchesSearch =
        searchTerm === "" ||
        mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.bio.toLowerCase().includes(searchTerm.toLowerCase());

      // Expertise filter
      const matchesExpertise =
        selectedExpertise === "all" ||
        mentor.expertise.includes(selectedExpertise);

      return matchesSearch && matchesExpertise;
    });
  };

  // Handle booking a session
  const handleBookSession = () => {
    if (!selectedMentor || !selectedDate || !selectedTime || !sessionTopic) {
      toast.error("Please fill all required fields");
      return;
    }

    // Create new session
    const newSession: MentorshipSession = {
      id: Date.now().toString(),
      mentorId: selectedMentor.id,
      studentId: currentUser?.id || "1",
      date: selectedDate,
      time: selectedTime,
      status: "scheduled",
      topic: sessionTopic,
      notes: sessionNotes,
    };

    // Add to sessions
    setSessions([...sessions, newSession]);

    // Reset form
    setSelectedDate("");
    setSelectedTime("");
    setSessionTopic("");
    setSessionNotes("");
    setShowBookSession(false);

    // Show success message
    toast.success("Session scheduled successfully", {
      description: `Your session with ${selectedMentor.name} has been booked for ${selectedDate} at ${selectedTime}.`,
    });
  };

  // Format date to readable format
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Mentorship Network</h1>
            <p className="text-muted-foreground">
              Connect with experienced mentors for guidance and career
              development
            </p>
          </div>
        </div>

        <Tabs
          defaultValue="explore"
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="explore">Find Mentors</TabsTrigger>
            <TabsTrigger value="sessions">My Sessions</TabsTrigger>
          </TabsList>

          <div className="mt-6 flex flex-col md:flex-row gap-3 items-start md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for mentors by name, title, or expertise..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="bg-background border rounded-md px-3 py-2 text-sm"
              value={selectedExpertise}
              onChange={(e) => setSelectedExpertise(e.target.value)}
            >
              <option value="all">All Expertise</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Programming">Programming</option>
              <option value="Design">Design</option>
              <option value="Biology">Biology</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Marketing">Marketing</option>
              <option value="Finance">Finance</option>
              <option value="Business">Business</option>
              <option value="AI/ML">AI & Machine Learning</option>
            </select>
          </div>

          <TabsContent value="explore" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMentors().length > 0 ? (
                filteredMentors().map((mentor) => (
                  <Card
                    key={mentor.id}
                    className={`overflow-hidden border-l-4 ${
                      mentor.isAvailable
                        ? "border-l-green-500"
                        : "border-l-orange-500"
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={mentor.avatar}
                              alt={mentor.name}
                            />
                            <AvatarFallback>
                              {mentor.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-base">
                              {mentor.name}
                            </CardTitle>
                            <CardDescription>
                              {mentor.title} at {mentor.company}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge
                          variant={mentor.isAvailable ? "default" : "outline"}
                        >
                          {mentor.isAvailable ? "Available" : "Limited"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {mentor.expertise.map((exp, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {exp}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm line-clamp-3 mb-3">{mentor.bio}</p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span>{mentor.rating}</span>
                          <span className="text-muted-foreground ml-1">
                            ({mentor.totalSessions} sessions)
                          </span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <School className="h-4 w-4 mr-1" />
                          <span>{mentor.yearOfExperience} years exp.</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedMentor(mentor);
                          setShowMentorDetails(true);
                        }}
                      >
                        View Profile
                      </Button>
                      <Button
                        size="sm"
                        disabled={!mentor.isAvailable}
                        onClick={() => {
                          setSelectedMentor(mentor);
                          setShowBookSession(true);
                        }}
                      >
                        Request Session
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <div className="bg-muted/30 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <UserRound className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No mentors found</h3>
                  <p className="text-muted-foreground max-w-md">
                    Try adjusting your search criteria to find mentors that
                    match your needs.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="sessions" className="mt-4">
            <div className="grid grid-cols-1 gap-4">
              {sessions.length > 0 ? (
                sessions.map((session) => {
                  const mentor = mentors.find((m) => m.id === session.mentorId);
                  if (!mentor) return null;

                  return (
                    <Card
                      key={session.id}
                      className={`overflow-hidden border-l-4 ${
                        session.status === "scheduled"
                          ? "border-l-blue-500"
                          : session.status === "completed"
                          ? "border-l-green-500"
                          : "border-l-red-500"
                      }`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage
                                src={mentor.avatar}
                                alt={mentor.name}
                              />
                              <AvatarFallback>
                                {mentor.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base">
                                Session with {mentor.name}
                              </CardTitle>
                              <CardDescription>
                                {mentor.title} at {mentor.company}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge
                            variant={
                              session.status === "scheduled"
                                ? "default"
                                : session.status === "completed"
                                ? "outline"
                                : "destructive"
                            }
                          >
                            {session.status === "scheduled"
                              ? "Upcoming"
                              : session.status === "completed"
                              ? "Completed"
                              : "Canceled"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{formatDate(session.date)}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{session.time}</span>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium mb-1">Topic</h4>
                            <p className="text-sm text-muted-foreground">
                              {session.topic}
                            </p>
                          </div>

                          {session.notes && (
                            <div>
                              <h4 className="text-sm font-medium mb-1">
                                Notes
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {session.notes}
                              </p>
                            </div>
                          )}

                          {session.feedback && (
                            <div>
                              <h4 className="text-sm font-medium mb-1">
                                Feedback
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {session.feedback}
                              </p>
                              {session.rating && (
                                <div className="flex items-center mt-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < session.rating!
                                          ? "text-yellow-500 fill-yellow-500"
                                          : "text-muted-foreground"
                                      }`}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end border-t pt-3 gap-2">
                        {session.status === "scheduled" && (
                          <>
                            <Button variant="outline" size="sm">
                              Reschedule
                            </Button>
                            <Button variant="default" size="sm">
                              <Video className="h-4 w-4 mr-2" />
                              Join Session
                            </Button>
                          </>
                        )}
                        {session.status === "completed" &&
                          !session.feedback && (
                            <Button variant="outline" size="sm">
                              Leave Feedback
                            </Button>
                          )}
                        {session.status === "completed" && session.feedback && (
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Message
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  );
                })
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <div className="bg-muted/30 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <Calendar className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No sessions yet</h3>
                  <p className="text-muted-foreground max-w-md">
                    When you schedule mentorship sessions, they will appear
                    here.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Mentor Details Dialog */}
        <Dialog open={showMentorDetails} onOpenChange={setShowMentorDetails}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            {selectedMentor && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-3 mb-1">
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={selectedMentor.avatar}
                        alt={selectedMentor.name}
                      />
                      <AvatarFallback>
                        {selectedMentor.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <DialogTitle>{selectedMentor.name}</DialogTitle>
                      <DialogDescription>
                        {selectedMentor.title} at {selectedMentor.company}
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center">
                    <School className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Education</p>
                      <p className="text-sm">{selectedMentor.education}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Experience
                      </p>
                      <p className="text-sm">
                        {selectedMentor.yearOfExperience} years
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 mr-2 text-yellow-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Rating</p>
                      <p className="text-sm">
                        {selectedMentor.rating} ({selectedMentor.totalSessions}{" "}
                        sessions)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">About</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedMentor.bio}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Expertise</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMentor.expertise.map((exp, index) => (
                        <Badge key={index} variant="secondary">
                          {exp}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Availability</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMentor.availability.map((day, index) => (
                        <Badge key={index} variant="outline">
                          {day}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    disabled={!selectedMentor.isAvailable}
                    onClick={() => {
                      setShowMentorDetails(false);
                      setShowBookSession(true);
                    }}
                  >
                    Request Session <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Book Session Dialog */}
        <Dialog open={showBookSession} onOpenChange={setShowBookSession}>
          <DialogContent className="max-w-md">
            {selectedMentor && (
              <>
                <DialogHeader>
                  <DialogTitle>
                    Book a Session with {selectedMentor.name}
                  </DialogTitle>
                  <DialogDescription>
                    Schedule a mentorship session to get personalized guidance
                    and advice.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 my-2">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <select
                      id="time"
                      className="w-full bg-background border rounded-md px-3 py-2 text-sm"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                    >
                      <option value="">Select a time slot</option>
                      <option value="09:00">9:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="13:00">1:00 PM</option>
                      <option value="14:00">2:00 PM</option>
                      <option value="15:00">3:00 PM</option>
                      <option value="16:00">4:00 PM</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="topic">Session Topic</Label>
                    <Input
                      id="topic"
                      placeholder="E.g., Career guidance, Portfolio review"
                      value={sessionTopic}
                      onChange={(e) => setSessionTopic(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Specific questions or topics you want to discuss"
                      value={sessionNotes}
                      onChange={(e) => setSessionNotes(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowBookSession(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleBookSession}>Book Session</Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Mentorship;

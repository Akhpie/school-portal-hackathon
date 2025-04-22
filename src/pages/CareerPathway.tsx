import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Compass,
  Sparkles,
  Briefcase,
  GraduationCap,
  BookOpen,
  Code,
  PenTool,
  Microscope,
  Stethoscope,
  Building2,
  Calculator,
  Share2,
  BookOpenCheck,
  ChevronRight,
  PlusCircle,
  Globe,
  ArrowUpRight,
  CheckCircle2,
  Rocket,
  Library,
  Brain,
  Lightbulb,
  Network,
  LineChart,
  Calendar,
  CompassIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useApp } from "@/contexts/AppContext";

interface CareerPath {
  id: string;
  name: string;
  icon: any;
  description: string;
  skills: string[];
  classes: string[];
  careers: string[];
  timeline: TimelineStep[];
  color: string;
}

interface TimelineStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  color?: string;
}

const CareerPathway = () => {
  const { currentUser } = useApp();
  const [selectedPath, setSelectedPath] = useState<string>("cs");
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);

  // Define career paths with their corresponding data
  const careerPaths: CareerPath[] = [
    {
      id: "cs",
      name: "Computer Science",
      icon: Code,
      description:
        "Explore the world of programming, algorithms, and software development. This pathway prepares you for careers in software engineering, data science, cybersecurity, and more.",
      skills: [
        "Programming",
        "Algorithms",
        "Data Structures",
        "Problem Solving",
        "Critical Thinking",
        "Collaboration",
      ],
      classes: [
        "AP Computer Science",
        "Data Structures & Algorithms",
        "Web Development",
        "Mobile App Development",
        "Cybersecurity Fundamentals",
      ],
      careers: [
        "Software Engineer",
        "Data Scientist",
        "Cybersecurity Analyst",
        "Machine Learning Engineer",
        "Full-Stack Developer",
        "DevOps Engineer",
      ],
      timeline: [
        {
          id: "highschool",
          title: "High School",
          description:
            "Build foundational knowledge with programming courses, AP Computer Science, and participation in coding clubs or hackathons.",
          icon: BookOpen,
        },
        {
          id: "college",
          title: "College",
          description:
            "Pursue a BS in Computer Science, focus on specializations, participate in internships, and build a portfolio of projects.",
          icon: GraduationCap,
        },
        {
          id: "entry",
          title: "Entry-Level Career",
          description:
            "Begin as a junior developer, software engineer, or IT professional. Focus on gaining practical experience and mentorship.",
          icon: Briefcase,
        },
        {
          id: "mid",
          title: "Mid-Career",
          description:
            "Progress to senior roles, specialize in an area of interest, and lead projects or teams. Consider further education or certifications.",
          icon: LineChart,
        },
        {
          id: "advanced",
          title: "Advanced Career",
          description:
            "Move into architectural roles, management positions, or entrepreneurship. Contribute to the field through innovation and leadership.",
          icon: Rocket,
        },
      ],
      color: "blue",
    },
    {
      id: "arts",
      name: "Arts & Design",
      icon: PenTool,
      description:
        "Develop your creativity and artistic skills through visual arts, design thinking, and digital media. This pathway leads to careers in graphic design, animation, UI/UX design, and more.",
      skills: [
        "Creativity",
        "Visual Thinking",
        "Design Principles",
        "Technical Skills",
        "Communication",
        "Project Management",
      ],
      classes: [
        "Visual Arts",
        "Graphic Design",
        "Digital Media",
        "UI/UX Design",
        "Portfolio Development",
      ],
      careers: [
        "Graphic Designer",
        "UI/UX Designer",
        "Animator",
        "Art Director",
        "Illustrator",
        "Product Designer",
      ],
      timeline: [
        {
          id: "highschool",
          title: "High School",
          description:
            "Take art classes, develop a portfolio, explore digital tools, and participate in art clubs or competitions.",
          icon: BookOpen,
        },
        {
          id: "college",
          title: "College",
          description:
            "Pursue a BFA in Design, Fine Arts, or related field. Build a professional portfolio and seek internships in creative agencies.",
          icon: GraduationCap,
        },
        {
          id: "entry",
          title: "Entry-Level Career",
          description:
            "Begin as a junior designer, production artist, or assistant. Gain industry experience and develop specialized skills.",
          icon: Briefcase,
        },
        {
          id: "mid",
          title: "Mid-Career",
          description:
            "Advance to senior designer roles, specialize in a design niche, and build a professional network. Consider freelancing opportunities.",
          icon: LineChart,
        },
        {
          id: "advanced",
          title: "Advanced Career",
          description:
            "Become an art director, creative director, or start your own studio. Mentor others and contribute to the evolution of design.",
          icon: Rocket,
        },
      ],
      color: "purple",
    },
    {
      id: "science",
      name: "Science & Research",
      icon: Microscope,
      description:
        "Investigate the natural world through scientific inquiry and research methods. This pathway prepares you for careers in research, laboratory science, and innovation.",
      skills: [
        "Scientific Method",
        "Analysis",
        "Lab Techniques",
        "Research",
        "Critical Thinking",
        "Technical Writing",
      ],
      classes: [
        "AP Biology",
        "AP Chemistry",
        "AP Physics",
        "Research Methods",
        "Data Analysis",
      ],
      careers: [
        "Research Scientist",
        "Laboratory Technician",
        "Environmental Scientist",
        "Biochemist",
        "Physicist",
        "Research Assistant",
      ],
      timeline: [
        {
          id: "highschool",
          title: "High School",
          description:
            "Take advanced science courses, participate in science fairs, and seek laboratory experience or research opportunities.",
          icon: BookOpen,
        },
        {
          id: "college",
          title: "College",
          description:
            "Pursue a BS in a scientific field, engage in undergraduate research, and build relationships with faculty mentors.",
          icon: GraduationCap,
        },
        {
          id: "graduate",
          title: "Graduate School",
          description:
            "Obtain an MS or PhD in your specialized field, conduct original research, and publish in academic journals.",
          icon: BookOpenCheck,
        },
        {
          id: "entry",
          title: "Early Career",
          description:
            "Begin as a research assistant, laboratory technician, or junior scientist in academic, government, or industry settings.",
          icon: Briefcase,
        },
        {
          id: "advanced",
          title: "Advanced Career",
          description:
            "Lead research teams, secure grants, publish significant findings, and contribute to scientific advancements in your field.",
          icon: Rocket,
        },
      ],
      color: "green",
    },
    {
      id: "medical",
      name: "Healthcare & Medicine",
      icon: Stethoscope,
      description:
        "Prepare for careers in healthcare, medicine, and wellness. This pathway develops your understanding of human health and provides a foundation for medical or healthcare professions.",
      skills: [
        "Medical Knowledge",
        "Patient Care",
        "Diagnosis",
        "Communication",
        "Empathy",
        "Attention to Detail",
      ],
      classes: [
        "Anatomy & Physiology",
        "AP Biology",
        "Medical Terminology",
        "Health Sciences",
        "Chemistry",
      ],
      careers: [
        "Physician",
        "Nurse",
        "Physician Assistant",
        "Medical Technician",
        "Physical Therapist",
        "Healthcare Administrator",
      ],
      timeline: [
        {
          id: "highschool",
          title: "High School",
          description:
            "Focus on biology, chemistry, and health sciences. Volunteer in healthcare settings and join health occupation clubs.",
          icon: BookOpen,
        },
        {
          id: "college",
          title: "Undergraduate",
          description:
            "Earn a BS in Biology, Health Sciences, or another pre-medical field. Fulfill prerequisites for medical or professional school.",
          icon: GraduationCap,
        },
        {
          id: "professional",
          title: "Professional School",
          description:
            "Complete medical school, nursing program, or other healthcare professional training. Obtain necessary licenses and certifications.",
          icon: BookOpenCheck,
        },
        {
          id: "residency",
          title: "Residency/Training",
          description:
            "Complete residency, internship, or specialized training in your chosen healthcare field. Develop practical skills.",
          icon: Brain,
        },
        {
          id: "career",
          title: "Professional Practice",
          description:
            "Establish your career in healthcare, pursue specialization, continuing education, and leadership opportunities.",
          icon: Rocket,
        },
      ],
      color: "red",
    },
    {
      id: "business",
      name: "Business & Entrepreneurship",
      icon: Building2,
      description:
        "Develop business acumen, leadership skills, and entrepreneurial thinking. This pathway prepares you for careers in management, marketing, finance, and entrepreneurship.",
      skills: [
        "Leadership",
        "Financial Literacy",
        "Communication",
        "Strategy",
        "Problem Solving",
        "Teamwork",
      ],
      classes: [
        "Business Principles",
        "Economics",
        "Accounting",
        "Marketing",
        "Entrepreneurship",
      ],
      careers: [
        "Business Manager",
        "Marketing Specialist",
        "Financial Analyst",
        "Entrepreneur",
        "Business Consultant",
        "Sales Director",
      ],
      timeline: [
        {
          id: "highschool",
          title: "High School",
          description:
            "Take business and economics courses, participate in DECA or other business clubs, and develop leadership skills.",
          icon: BookOpen,
        },
        {
          id: "college",
          title: "College",
          description:
            "Earn a BBA or related degree, participate in internships, and build a professional network through clubs and events.",
          icon: GraduationCap,
        },
        {
          id: "entry",
          title: "Entry-Level Career",
          description:
            "Begin in roles such as business analyst, marketing associate, or management trainee to gain practical experience.",
          icon: Briefcase,
        },
        {
          id: "mid",
          title: "Mid-Career",
          description:
            "Advance to management positions, specialize in your area of interest, and consider an MBA for further advancement.",
          icon: LineChart,
        },
        {
          id: "advanced",
          title: "Advanced Career",
          description:
            "Move into executive roles, start your own business, or become a consultant. Focus on strategic leadership and innovation.",
          icon: Rocket,
        },
      ],
      color: "amber",
    },
  ];

  // Find the selected career path
  const activePath =
    careerPaths.find((path) => path.id === selectedPath) || careerPaths[0];

  // Get color class based on the path's color
  const getColorClass = (
    color: string,
    type: "bg" | "text" | "border" | "hover"
  ) => {
    const colorMap = {
      blue: {
        bg: "bg-blue-500",
        text: "text-blue-500",
        border: "border-blue-500",
        hover: "hover:bg-blue-500 hover:text-white",
      },
      green: {
        bg: "bg-green-500",
        text: "text-green-500",
        border: "border-green-500",
        hover: "hover:bg-green-500 hover:text-white",
      },
      purple: {
        bg: "bg-purple-500",
        text: "text-purple-500",
        border: "border-purple-500",
        hover: "hover:bg-purple-500 hover:text-white",
      },
      red: {
        bg: "bg-red-500",
        text: "text-red-500",
        border: "border-red-500",
        hover: "hover:bg-red-500 hover:text-white",
      },
      amber: {
        bg: "bg-amber-500",
        text: "text-amber-500",
        border: "border-amber-500",
        hover: "hover:bg-amber-500 hover:text-white",
      },
    };

    return (
      colorMap[color as keyof typeof colorMap]?.[type] || colorMap.blue[type]
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold gradient-text flex items-center gap-2 mt-4 md:mt-0">
              Career Pathway Guide
            </h1>
            <p className="text-muted-foreground">
              Explore potential career paths and plan your journey from high
              school to your dream career
            </p>
          </div>
          <Badge
            variant="outline"
            className="px-2 py-1 border-primary text-primary flex items-center gap-1 mt-4 md:mt-0"
          >
            <Sparkles className="h-3 w-3" />
            {currentUser?.grade
              ? `Grade ${currentUser.grade}`
              : "Student Guide"}
          </Badge>
        </div>

        {/* Career Path Selection */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Path Selection Cards */}
          <div className="md:col-span-1 space-y-4">
            <h2 className="text-lg font-medium mb-2 flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Career Paths
            </h2>

            {careerPaths.map((path) => (
              <div
                key={path.id}
                onClick={() => setSelectedPath(path.id)}
                className={cn(
                  "p-3 rounded-lg border cursor-pointer transition-all duration-300",
                  selectedPath === path.id
                    ? `border-l-4 ${getColorClass(
                        path.color,
                        "border"
                      )} bg-accent/50 shadow-md`
                    : "border-transparent hover:bg-accent/30"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "p-2 rounded-full",
                      selectedPath === path.id
                        ? getColorClass(path.color, "bg")
                        : "bg-muted"
                    )}
                  >
                    <path.icon
                      className={cn(
                        "h-5 w-5",
                        selectedPath === path.id
                          ? "text-white"
                          : getColorClass(path.color, "text")
                      )}
                    />
                  </div>
                  <div>
                    <p className="font-medium">{path.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {path.careers.length} career options
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <Button variant="outline" className="w-full text-sm gap-1 mt-2">
              <PlusCircle className="h-4 w-4" />
              <span>Discover More Paths</span>
            </Button>
          </div>

          {/* Career Path Details */}
          <div className="md:col-span-4">
            <Card
              className="border-t-4 overflow-hidden relative"
              style={{ borderTopColor: `var(--${activePath.color}-500)` }}
            >
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 -mt-2 -mr-2 opacity-20">
                <Sparkles className="h-32 w-32 text-primary" />
              </div>

              <CardHeader>
                <div className="flex items-center gap-3">
                  <div
                    className={`p-3 rounded-full ${getColorClass(
                      activePath.color,
                      "bg"
                    )}`}
                  >
                    <activePath.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">
                      {activePath.name}
                    </CardTitle>
                    <CardDescription>{activePath.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid grid-cols-4 mb-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="skills">Skills</TabsTrigger>
                    <TabsTrigger value="classes">Classes</TabsTrigger>
                    <TabsTrigger value="careers">Careers</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <GraduationCap className="h-5 w-5" />
                        Career Timeline
                      </h3>
                      <p className="text-sm text-muted-foreground mb-6">
                        Explore the recommended journey from high school to a
                        successful career in {activePath.name}
                      </p>

                      {/* Animated Timeline */}
                      <div className="relative pb-6">
                        {/* Timeline Track */}
                        <div className="absolute left-[22px] top-6 h-[calc(100%-70px)] w-1 bg-muted" />

                        {/* Timeline Steps */}
                        <div className="space-y-10 relative">
                          {activePath.timeline.map((step, index) => (
                            <div
                              key={step.id}
                              className="relative"
                              onMouseEnter={() => setHoveredStep(step.id)}
                              onMouseLeave={() => setHoveredStep(null)}
                            >
                              <div
                                className={cn(
                                  "flex items-start gap-4 transition-all duration-500",
                                  hoveredStep === step.id && "translate-x-2"
                                )}
                              >
                                <div
                                  className={cn(
                                    "rounded-full p-3 z-10 transition-all duration-300",
                                    getColorClass(activePath.color, "bg"),
                                    hoveredStep === step.id ? "scale-110" : ""
                                  )}
                                >
                                  <step.icon className="h-5 w-5 text-white" />
                                </div>
                                <div
                                  className={cn(
                                    "bg-card p-4 rounded-lg border shadow-sm transition-all duration-300",
                                    hoveredStep === step.id && "shadow-md"
                                  )}
                                >
                                  <h4 className="font-medium text-lg flex items-center gap-2">
                                    {step.title}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    {step.description}
                                  </p>
                                </div>
                              </div>

                              {/* Connected Lines Animation */}
                              {index < activePath.timeline.length - 1 && (
                                <div
                                  className={cn(
                                    "absolute left-[22px] ml-[2px] w-1 bg-gradient-to-b from-transparent via-current to-transparent",
                                    getColorClass(activePath.color, "text"),
                                    hoveredStep === step.id ||
                                      hoveredStep ===
                                        activePath.timeline[index + 1].id
                                      ? "h-10 opacity-100"
                                      : "h-0 opacity-0"
                                  )}
                                  style={{
                                    top: "60px",
                                    transition: "all 0.3s ease-in-out",
                                  }}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center mt-6">
                      <Button
                        className={cn(
                          "gap-2 text-white",
                          getColorClass(activePath.color, "bg")
                        )}
                      >
                        <Compass className="h-4 w-4" />
                        <span>Explore This Pathway</span>
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="skills" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activePath.skills.map((skill, index) => (
                        <div
                          key={index}
                          className="bg-muted/30 rounded-lg p-4 border flex items-center gap-3 hover:shadow-md transition-all duration-300"
                        >
                          <div
                            className={cn(
                              "p-2 rounded-full",
                              getColorClass(activePath.color, "bg")
                            )}
                          >
                            <CheckCircle2 className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <p className="font-medium">{skill}</p>
                            <div className="mt-1">
                              <Progress
                                value={Math.random() * 40 + 60}
                                className="h-1"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 p-4 bg-accent/50 rounded-lg border">
                      <h4 className="font-medium flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-amber-500" />
                        Why These Skills Matter
                      </h4>
                      <p className="text-sm text-muted-foreground mt-2">
                        These in-demand skills will prepare you for success in
                        the {activePath.name} field. They combine technical
                        expertise with essential soft skills that employers
                        value.
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="classes" className="space-y-6">
                    <div className="grid grid-cols-1 gap-3">
                      {activePath.classes.map((className, index) => (
                        <div
                          key={index}
                          className="bg-card rounded-lg p-4 border flex justify-between items-center hover:shadow-md transition-all duration-300"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "p-2 rounded-full",
                                getColorClass(activePath.color, "bg")
                              )}
                            >
                              <BookOpen className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <p className="font-medium">{className}</p>
                              <p className="text-xs text-muted-foreground">
                                Recommended for{" "}
                                {index < 2
                                  ? "Grade 9-10"
                                  : index < 4
                                  ? "Grade 11-12"
                                  : "Advanced Students"}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Info className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex flex-col md:flex-row justify-between items-center gap-4 p-4 bg-accent/50 rounded-lg border">
                      <div className="flex-1">
                        <h4 className="font-medium flex items-center gap-2">
                          <Library className="h-5 w-5 text-primary" />
                          Course Planning
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          These recommended courses will help you build a strong
                          foundation in {activePath.name}.
                        </p>
                      </div>
                      <Button className="gap-2" variant="outline">
                        <Calendar className="h-4 w-4" />
                        <span>Add to My Plan</span>
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="careers" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activePath.careers.map((career, index) => (
                        <Card
                          key={index}
                          className="overflow-hidden hover:shadow-md transition-all duration-300"
                        >
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center justify-between">
                              {career}
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs",
                                  getColorClass(activePath.color, "text"),
                                  getColorClass(activePath.color, "border")
                                )}
                              >
                                {index % 3 === 0
                                  ? "High Demand"
                                  : index % 3 === 1
                                  ? "Growing Field"
                                  : "Established"}
                              </Badge>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pb-3">
                            <div className="flex justify-between items-center text-sm">
                              <div className="flex items-center gap-2">
                                <LineChart className="h-4 w-4 text-muted-foreground" />
                                <span>
                                  {index % 2 === 0 ? "$80K-120K" : "$60K-100K"}{" "}
                                  avg. salary
                                </span>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                className={cn(
                                  "p-0 h-8 gap-1",
                                  getColorClass(activePath.color, "text")
                                )}
                              >
                                <span className="text-xs">Learn More</span>
                                <ArrowUpRight className="h-3 w-3" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <div className="mt-4 p-4 bg-accent/50 rounded-lg border">
                      <h4 className="font-medium flex items-center gap-2">
                        <Network className="h-5 w-5 text-primary" />
                        Connect with Professionals
                      </h4>
                      <p className="text-sm text-muted-foreground mt-2">
                        Meet with professionals working in these careers to gain
                        insights and advice on your career path.
                      </p>
                      <Button
                        className="mt-4 w-full sm:w-auto gap-2"
                        variant="outline"
                      >
                        <Globe className="h-4 w-4" />
                        <span>Find Mentors</span>
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

// Missing Info icon component used in the code
const Info = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
};

export default CareerPathway;

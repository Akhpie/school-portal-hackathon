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
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/sonner";
import {
  Briefcase,
  Building,
  Calendar,
  Clock,
  Filter,
  GraduationCap,
  Heart,
  MapPin,
  Search,
  Bookmark,
  ExternalLink,
  BookmarkCheck,
  CheckCircle2,
  ArrowRight,
  Star,
  BadgeCheck,
  BarChart,
  Globe,
  BookOpen,
  PlusCircle,
  FileText,
  ClipboardList,
  RotateCcw,
  Download,
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";

// Types for job listings and applications
interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "internship" | "part-time" | "full-time";
  category: string;
  deadline: string;
  postedDate: string;
  description: string;
  requirements: string[];
  skills: string[];
  salary?: string;
  logo: string;
  isBookmarked: boolean;
  isNew: boolean;
  url: string;
}

interface Application {
  id: string;
  jobId: string;
  status:
    | "draft"
    | "submitted"
    | "inProgress"
    | "interview"
    | "offer"
    | "rejected";
  appliedDate: string;
  notes: string;
  interviewDate?: string;
  interviewTime?: string;
  lastUpdated?: string;
  listing?: JobListing;
}

// Initialize IndexedDB
const initializeDB = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open("SchoolVerseDB", 3);

    request.onerror = (event) => {
      console.error("Error opening IndexedDB:", event);
      reject("Error opening database");
    };

    request.onupgradeneeded = (event) => {
      const db = request.result;

      // Create job listings store if it doesn't exist
      if (!db.objectStoreNames.contains("jobListings")) {
        db.createObjectStore("jobListings", { keyPath: "id" });
      }

      // Create applications store if it doesn't exist
      if (!db.objectStoreNames.contains("applications")) {
        const applicationsStore = db.createObjectStore("applications", {
          keyPath: "id",
        });
        applicationsStore.createIndex("jobId", "jobId", { unique: false });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };
  });
};

// Helper function to access job listings store
const getJobListingsStore = async (mode: IDBTransactionMode = "readonly") => {
  const db = await initializeDB();
  const transaction = db.transaction("jobListings", mode);
  return transaction.objectStore("jobListings");
};

// Helper function to access applications store
const getApplicationsStore = async (mode: IDBTransactionMode = "readonly") => {
  const db = await initializeDB();
  const transaction = db.transaction("applications", mode);
  return transaction.objectStore("applications");
};

// Sample job listings data
const sampleJobListings: JobListing[] = [
  {
    id: "1",
    title: "Software Development Intern",
    company: "TechNova Solutions",
    location: "San Francisco, CA (Remote)",
    type: "internship",
    category: "Software Development",
    deadline: "2025-06-15",
    postedDate: "2025-04-01",
    description:
      "Join our dynamic team of developers working on cutting-edge web applications. You'll gain hands-on experience with React, Node.js, and cloud technologies while contributing to real-world projects.",
    requirements: [
      "Currently pursuing a degree in Computer Science or related field",
      "Knowledge of JavaScript, HTML, and CSS",
      "Basic understanding of web development frameworks",
      "Strong problem-solving skills",
    ],
    skills: ["JavaScript", "React", "Node.js", "Git", "Problem Solving"],
    salary: "$25-30/hr",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=TN&backgroundColor=4f46e5",
    isBookmarked: false,
    isNew: true,
    url: "https://example.com/job1",
  },
  {
    id: "2",
    title: "UX/UI Design Intern",
    company: "CreativeMinds Agency",
    location: "New York, NY (Hybrid)",
    type: "internship",
    category: "Design",
    deadline: "2025-05-30",
    postedDate: "2025-04-02",
    description:
      "Work alongside our design team to create beautiful and functional user interfaces. You'll participate in user research, wireframing, prototyping, and usability testing.",
    requirements: [
      "Pursuing a degree in Design, HCI, or related field",
      "Portfolio demonstrating UI/UX projects",
      "Experience with design tools such as Figma or Adobe XD",
      "Understanding of design principles and user-centered design",
    ],
    skills: [
      "UI Design",
      "Figma",
      "User Research",
      "Prototyping",
      "Wireframing",
    ],
    salary: "$22-28/hr",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=CM&backgroundColor=be185d",
    isBookmarked: false,
    isNew: true,
    url: "https://example.com/job2",
  },
  {
    id: "3",
    title: "Data Science Research Assistant",
    company: "QuantumData Analytics",
    location: "Boston, MA (On-site)",
    type: "part-time",
    category: "Data Science",
    deadline: "2025-06-01",
    postedDate: "2025-03-25",
    description:
      "Support our research team in analyzing complex datasets and developing machine learning models. You'll work on real-world problems in fields such as healthcare, finance, and environmental science.",
    requirements: [
      "Pursuing a degree in Mathematics, Statistics, Computer Science, or related field",
      "Experience with Python and data analysis libraries",
      "Basic understanding of machine learning concepts",
      "Strong analytical and problem-solving skills",
    ],
    skills: [
      "Python",
      "Data Analysis",
      "Machine Learning",
      "Statistics",
      "SQL",
    ],
    salary: "$24-30/hr",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=QD&backgroundColor=0891b2",
    isBookmarked: false,
    isNew: false,
    url: "https://example.com/job3",
  },
  {
    id: "4",
    title: "Marketing Coordinator",
    company: "GlobalBrand Enterprises",
    location: "Chicago, IL (Remote)",
    type: "part-time",
    category: "Marketing",
    deadline: "2025-05-15",
    postedDate: "2025-03-20",
    description:
      "Assist our marketing team in developing and implementing campaigns across digital channels. You'll gain experience in social media management, content creation, and marketing analytics.",
    requirements: [
      "Pursuing a degree in Marketing, Communications, or related field",
      "Strong writing and communication skills",
      "Experience with social media platforms",
      "Basic understanding of marketing analytics",
    ],
    skills: [
      "Social Media",
      "Content Creation",
      "Analytics",
      "Communication",
      "Adobe Creative Suite",
    ],
    salary: "$20-25/hr",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=GB&backgroundColor=ca8a04",
    isBookmarked: false,
    isNew: false,
    url: "https://example.com/job4",
  },
  {
    id: "5",
    title: "Biomedical Research Intern",
    company: "LifeSciences Research Institute",
    location: "Seattle, WA (On-site)",
    type: "internship",
    category: "Sciences",
    deadline: "2025-06-30",
    postedDate: "2025-04-05",
    description:
      "Join our research team working on cutting-edge biomedical projects. You'll assist in laboratory experiments, data collection, and analysis under the mentorship of experienced researchers.",
    requirements: [
      "Pursuing a degree in Biology, Chemistry, Biomedical Engineering, or related field",
      "Laboratory experience preferred",
      "Strong attention to detail",
      "Interest in biomedical research",
    ],
    skills: [
      "Laboratory Techniques",
      "Data Analysis",
      "Documentation",
      "Research Methods",
    ],
    salary: "$23-28/hr",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=LS&backgroundColor=16a34a",
    isBookmarked: false,
    isNew: true,
    url: "https://example.com/job5",
  },
];

const Internships = () => {
  const { currentUser } = useApp();
  const [activeTab, setActiveTab] = useState("explore");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [selectedListing, setSelectedListing] = useState<JobListing | null>(
    null
  );
  const [showListingDetails, setShowListingDetails] = useState(false);
  const [bookmarkedListings, setBookmarkedListings] = useState<string[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobListings, setJobListings] = useState<JobListing[]>([]);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [showApplicationDetails, setShowApplicationDetails] = useState(false);
  const [applicationForm, setApplicationForm] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: "",
    linkedInUrl: "",
    portfolioUrl: "",
    additionalInfo: "",
  });

  // Load data on component mount
  useEffect(() => {
    // Load data from localStorage
    const loadBookmarks = () => {
      try {
        const storedBookmarks = localStorage.getItem("jobBookmarks");
        if (storedBookmarks) {
          setBookmarkedListings(JSON.parse(storedBookmarks));
        }
      } catch (e) {
        console.error("Error loading bookmarks:", e);
      }
    };

    // Initialize job listings with sample data and bookmark status
    const initializeListings = async () => {
      try {
        const store = await getJobListingsStore("readwrite");
        const countRequest = store.count();

        countRequest.onsuccess = () => {
          if (countRequest.result === 0) {
            // Only add sample listings if the database is empty
            sampleJobListings.forEach((listing) => {
              store.add(listing);
            });
            console.log("Sample job listings added to IndexedDB");

            // Update with bookmark status
            const updatedListings = sampleJobListings.map((listing) => ({
              ...listing,
              isBookmarked: bookmarkedListings.includes(listing.id),
            }));
            setJobListings(updatedListings);
          } else {
            // Get all listings from IndexedDB
            const getAllRequest = store.getAll();
            getAllRequest.onsuccess = () => {
              const listings = getAllRequest.result;
              const updatedListings = listings.map((listing: JobListing) => ({
                ...listing,
                isBookmarked: bookmarkedListings.includes(listing.id),
              }));
              setJobListings(updatedListings);
            };
          }
        };
      } catch (e) {
        console.error("Error initializing job listings:", e);
        // Fallback to sample data if IndexedDB fails
        const updatedListings = sampleJobListings.map((listing) => ({
          ...listing,
          isBookmarked: bookmarkedListings.includes(listing.id),
        }));
        setJobListings(updatedListings);
      }
    };

    // Load applications from IndexedDB
    const loadApplications = async () => {
      try {
        const store = await getApplicationsStore();
        const getAllRequest = store.getAll();
        getAllRequest.onsuccess = () => {
          setApplications(getAllRequest.result);
        };
      } catch (e) {
        console.error("Error loading applications:", e);
      }
    };

    // Execute all initialization functions
    loadBookmarks();
    initializeListings();
    loadApplications();
  }, []);

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("jobBookmarks", JSON.stringify(bookmarkedListings));

    // Update job listings with new bookmark status
    setJobListings((prev) =>
      prev.map((listing) => ({
        ...listing,
        isBookmarked: bookmarkedListings.includes(listing.id),
      }))
    );
  }, [bookmarkedListings]);

  // Toggle bookmark for a job listing
  const toggleBookmark = (jobId: string) => {
    setBookmarkedListings((prev) => {
      if (prev.includes(jobId)) {
        toast.success("Bookmark removed", {
          description: "Job listing removed from your bookmarks",
        });
        return prev.filter((id) => id !== jobId);
      } else {
        toast.success("Job bookmarked", {
          description: "Job listing added to your bookmarks",
        });
        return [...prev, jobId];
      }
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

  // Calculate days remaining until deadline
  const getDaysRemaining = (deadline: string): number => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Apply filters to job listings
  const filteredListings = () => {
    return jobListings.filter((listing) => {
      // Search term filter
      const matchesSearch =
        searchTerm === "" ||
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const matchesCategory =
        filterCategory === "all" || listing.category === filterCategory;

      // Type filter
      const matchesType = filterType === "all" || listing.type === filterType;

      // Bookmarked filter (for saved tab)
      const matchesBookmarked = activeTab !== "saved" || listing.isBookmarked;

      return (
        matchesSearch && matchesCategory && matchesType && matchesBookmarked
      );
    });
  };

  // Handle form input changes
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setApplicationForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file changes
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "resume" | "coverLetter"
  ) => {
    if (e.target.files && e.target.files[0]) {
      if (type === "resume") {
        setResumeFile(e.target.files[0]);
      } else {
        setCoverLetterFile(e.target.files[0]);
      }
    }
  };

  // Handle application submission
  const handleApplySubmit = () => {
    // Create a new application
    const newApplication: Application = {
      id: Date.now().toString(),
      jobId: selectedListing?.id || "",
      status: "submitted",
      appliedDate: new Date().toISOString().split("T")[0],
      notes: applicationForm.additionalInfo,
    };

    // Add application to state
    setApplications((prev) => [...prev, newApplication]);

    // Close the dialog
    setShowApplyForm(false);
    setShowListingDetails(false);

    // Show success message
    toast.success("Application submitted successfully", {
      description: "You can track your application in the Applications tab",
    });

    // Reset form
    setCoverLetterFile(null);
    setResumeFile(null);
    setApplicationForm({
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      phone: "",
      linkedInUrl: "",
      portfolioUrl: "",
      additionalInfo: "",
    });

    // Navigate to applications tab
    setActiveTab("applications");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Internships & Jobs</h1>
            <p className="text-muted-foreground">
              Discover opportunities to gain experience and build your career
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex items-center gap-2"
            onClick={() => {
              // Create a dummy application to demonstrate the feature
              const newApplication = {
                id: Date.now().toString(),
                jobId: "1", // Using the first job as an example
                status: "draft",
                appliedDate: new Date().toISOString().split("T")[0],
                notes: "Application in progress",
              } as Application;

              setApplications((prev) => [...prev, newApplication]);
              setActiveTab("applications");
              toast.success("Draft application created", {
                description:
                  "Continue your application in the Applications tab",
              });
            }}
          >
            <PlusCircle className="h-4 w-4" />
            <span>Create Application</span>
          </Button>
        </div>

        <Tabs
          defaultValue="explore"
          onValueChange={setActiveTab}
          value={activeTab}
          className="w-full"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between mb-6">
            <TabsList className="grid w-full sm:w-auto grid-cols-3 max-w-md">
              <TabsTrigger value="explore">Explore</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
            </TabsList>

            <Button
              variant="outline"
              size="sm"
              className="flex md:hidden items-center gap-2 w-full sm:w-auto"
              onClick={() => {
                // Create a dummy application to demonstrate the feature
                const newApplication = {
                  id: Date.now().toString(),
                  jobId: "1", // Using the first job as an example
                  status: "draft",
                  appliedDate: new Date().toISOString().split("T")[0],
                  notes: "Application in progress",
                } as Application;

                setApplications((prev) => [...prev, newApplication]);
                setActiveTab("applications");
                toast.success("Draft application created", {
                  description:
                    "Continue your application in the Applications tab",
                });
              }}
            >
              <PlusCircle className="h-4 w-4" />
              <span>Create Application</span>
            </Button>
          </div>

          <div className="space-y-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for internships or jobs..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="category-filter">Category</Label>
                <Select
                  value={filterCategory}
                  onValueChange={setFilterCategory}
                >
                  <SelectTrigger id="category-filter" className="w-full">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Software Development">
                      Software Development
                    </SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Sciences">Sciences</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type-filter">Job Type</Label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger id="type-filter" className="w-full">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="internship">Internships</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="full-time">Full-time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <TabsContent value="explore" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredListings().length > 0 ? (
                filteredListings().map((listing) => (
                  <Card
                    key={listing.id}
                    className="overflow-hidden h-full flex flex-col transition-all duration-200 hover:shadow-md group"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded overflow-hidden bg-primary/10 flex items-center justify-center">
                            <img
                              src={listing.logo}
                              alt={`${listing.company} logo`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <CardTitle className="text-base truncate max-w-[180px] sm:max-w-[240px]">
                              {listing.title}
                            </CardTitle>
                            <CardDescription className="truncate max-w-[180px] sm:max-w-[240px]">
                              {listing.company}
                            </CardDescription>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(listing.id);
                          }}
                          className="h-8 w-8"
                        >
                          {listing.isBookmarked ? (
                            <BookmarkCheck className="h-5 w-5 text-primary" />
                          ) : (
                            <Bookmark className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3 flex-grow">
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1 truncate max-w-full"
                        >
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{listing.location}</span>
                        </Badge>
                        <Badge
                          variant={
                            listing.type === "internship"
                              ? "default"
                              : listing.type === "part-time"
                              ? "outline"
                              : "secondary"
                          }
                          className="flex items-center gap-1"
                        >
                          <Briefcase className="h-3 w-3 flex-shrink-0" />
                          {listing.type === "internship"
                            ? "Internship"
                            : listing.type === "part-time"
                            ? "Part-time"
                            : "Full-time"}
                        </Badge>
                        {listing.isNew && (
                          <Badge className="bg-green-500" variant="secondary">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm line-clamp-2 mb-3">
                        {listing.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {listing.skills.slice(0, 3).map((skill, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                        {listing.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{listing.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-3 mt-auto">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                        <span className="truncate">
                          {getDaysRemaining(listing.deadline) > 0
                            ? `${getDaysRemaining(listing.deadline)} days left`
                            : "Deadline passed"}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedListing(listing);
                          setShowListingDetails(true);
                        }}
                        className="ml-2 flex-shrink-0"
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <div className="bg-muted/30 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <Briefcase className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">
                    No listings found
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    Try adjusting your search or filters to find more
                    opportunities.
                  </p>
                  <Button
                    onClick={() => {
                      setSearchTerm("");
                      setFilterCategory("all");
                      setFilterType("all");
                    }}
                    className="mt-4"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="saved" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredListings().length > 0 ? (
                filteredListings().map((listing) => (
                  <Card
                    key={listing.id}
                    className="overflow-hidden h-full flex flex-col transition-all duration-200 hover:shadow-md group"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded overflow-hidden bg-primary/10 flex items-center justify-center">
                            <img
                              src={listing.logo}
                              alt={`${listing.company} logo`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <CardTitle className="text-base truncate max-w-[180px] sm:max-w-[240px]">
                              {listing.title}
                            </CardTitle>
                            <CardDescription className="truncate max-w-[180px] sm:max-w-[240px]">
                              {listing.company}
                            </CardDescription>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(listing.id);
                          }}
                          className="h-8 w-8"
                        >
                          <BookmarkCheck className="h-5 w-5 text-primary" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3 flex-grow">
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1 truncate max-w-full"
                        >
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{listing.location}</span>
                        </Badge>
                        <Badge
                          variant={
                            listing.type === "internship"
                              ? "default"
                              : listing.type === "part-time"
                              ? "outline"
                              : "secondary"
                          }
                          className="flex items-center gap-1"
                        >
                          <Briefcase className="h-3 w-3 flex-shrink-0" />
                          {listing.type === "internship"
                            ? "Internship"
                            : listing.type === "part-time"
                            ? "Part-time"
                            : "Full-time"}
                        </Badge>
                        {listing.isNew && (
                          <Badge className="bg-green-500" variant="secondary">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm line-clamp-2 mb-3">
                        {listing.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {listing.skills.slice(0, 3).map((skill, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                        {listing.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{listing.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-3 mt-auto">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                        <span className="truncate">
                          {getDaysRemaining(listing.deadline) > 0
                            ? `${getDaysRemaining(listing.deadline)} days left`
                            : "Deadline passed"}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedListing(listing);
                          setShowListingDetails(true);
                        }}
                        className="ml-2 flex-shrink-0"
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <div className="bg-muted/30 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <Bookmark className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">
                    No saved listings
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    Bookmark jobs and internships to keep track of opportunities
                    that interest you.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="applications" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {applications.length > 0 ? (
                applications.map((application) => (
                  <Card
                    key={application.id}
                    className="overflow-hidden h-full flex flex-col transition-all duration-200 hover:shadow-md"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded overflow-hidden bg-primary/10 flex items-center justify-center">
                            <img
                              src={application.listing?.logo}
                              alt={`${application.listing?.company} logo`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <CardTitle className="text-base truncate max-w-[180px] sm:max-w-[240px]">
                              {application.listing?.title}
                            </CardTitle>
                            <CardDescription className="truncate max-w-[180px] sm:max-w-[240px]">
                              {application.listing?.company}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge
                          variant={
                            application.status === "submitted"
                              ? "outline"
                              : application.status === "interview"
                              ? "default"
                              : application.status === "offer"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {application.status === "submitted"
                            ? "Applied"
                            : application.status === "interview"
                            ? "Interview"
                            : application.status === "offer"
                            ? "Offer"
                            : "Rejected"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3 flex-grow">
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1 truncate max-w-full"
                        >
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">
                            {application.listing?.location}
                          </span>
                        </Badge>
                        <Badge
                          variant={
                            application.listing?.type === "internship"
                              ? "default"
                              : application.listing?.type === "part-time"
                              ? "outline"
                              : "secondary"
                          }
                          className="flex items-center gap-1"
                        >
                          <Briefcase className="h-3 w-3 flex-shrink-0" />
                          {application.listing?.type === "internship"
                            ? "Internship"
                            : application.listing?.type === "part-time"
                            ? "Part-time"
                            : "Full-time"}
                        </Badge>
                      </div>

                      <dl className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Applied:</dt>
                          <dd className="font-medium">
                            {new Date(
                              application.appliedDate
                            ).toLocaleDateString()}
                          </dd>
                        </div>

                        {application.status === "interview" && (
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">
                              Interview:
                            </dt>
                            <dd className="font-medium">
                              {new Date(
                                application.interviewDate
                              ).toLocaleDateString()}{" "}
                              at {application.interviewTime}
                            </dd>
                          </div>
                        )}

                        {application.lastUpdated && (
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">
                              Last Updated:
                            </dt>
                            <dd className="font-medium">
                              {new Date(
                                application.lastUpdated
                              ).toLocaleDateString()}
                            </dd>
                          </div>
                        )}
                      </dl>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-3 mt-auto">
                      <Button variant="ghost" size="sm" className="flex-1">
                        <FileText className="h-4 w-4 mr-2" />
                        Resume
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          // Find the job listing for this application
                          const job = jobListings.find(
                            (j) => j.id === application.jobId
                          );

                          // Update the application with job listing data
                          const appWithListing = {
                            ...application,
                            listing: job,
                          };

                          // Set the selected application and show details
                          setSelectedApplication(appWithListing);
                          setShowApplicationDetails(true);
                        }}
                        className="flex-1"
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <div className="bg-muted/30 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <ClipboardList className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">
                    No applications yet
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    Start applying to internships and jobs to track your
                    application progress here.
                  </p>
                  <Button
                    onClick={() => {
                      setActiveTab("explore");
                    }}
                    className="mt-4"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Explore Opportunities
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Job Details Dialog */}
        <Dialog open={showListingDetails} onOpenChange={setShowListingDetails}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            {selectedListing && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-12 h-12 rounded overflow-hidden bg-primary/10 flex items-center justify-center">
                      <img
                        src={selectedListing.logo}
                        alt={`${selectedListing.company} logo`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <DialogTitle>{selectedListing.title}</DialogTitle>
                      <DialogDescription>
                        {selectedListing.company}
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <MapPin className="h-3 w-3" />
                    {selectedListing.location}
                  </Badge>
                  <Badge
                    variant={
                      selectedListing.type === "internship"
                        ? "default"
                        : selectedListing.type === "part-time"
                        ? "outline"
                        : "secondary"
                    }
                    className="flex items-center gap-1"
                  >
                    <Briefcase className="h-3 w-3" />
                    {selectedListing.type === "internship"
                      ? "Internship"
                      : selectedListing.type === "part-time"
                      ? "Part-time"
                      : "Full-time"}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Deadline: {formatDate(selectedListing.deadline)}
                  </Badge>
                  {selectedListing.salary && (
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <BarChart className="h-3 w-3" />
                      {selectedListing.salary}
                    </Badge>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedListing.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Requirements</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {selectedListing.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedListing.skills.map((skill, index) => (
                        <Badge key={index} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                  <Button
                    variant="outline"
                    className="sm:mr-auto"
                    onClick={() => toggleBookmark(selectedListing.id)}
                  >
                    {selectedListing.isBookmarked ? (
                      <>
                        <BookmarkCheck className="mr-2 h-4 w-4" /> Saved
                      </>
                    ) : (
                      <>
                        <Bookmark className="mr-2 h-4 w-4" /> Save
                      </>
                    )}
                  </Button>
                  <a
                    href={selectedListing.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" className="w-full sm:w-auto">
                      <ExternalLink className="mr-2 h-4 w-4" /> Visit Website
                    </Button>
                  </a>
                  <Button
                    className="w-full sm:w-auto"
                    onClick={() => setShowApplyForm(true)}
                  >
                    Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Apply Now Dialog */}
        <Dialog open={showApplyForm} onOpenChange={setShowApplyForm}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Apply for {selectedListing?.title}</DialogTitle>
              <DialogDescription>
                Complete the form below to apply for this position at{" "}
                {selectedListing?.company}.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your full name"
                    value={applicationForm.name}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Your email address"
                    value={applicationForm.email}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="Your phone number"
                    value={applicationForm.phone}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedInUrl">LinkedIn URL (Optional)</Label>
                  <Input
                    id="linkedInUrl"
                    name="linkedInUrl"
                    placeholder="https://linkedin.com/in/yourprofile"
                    value={applicationForm.linkedInUrl}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="portfolioUrl">Portfolio URL (Optional)</Label>
                  <Input
                    id="portfolioUrl"
                    name="portfolioUrl"
                    placeholder="https://yourportfolio.com"
                    value={applicationForm.portfolioUrl}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="resume">Resume/CV (PDF or DOCX)</Label>
                <div className="border rounded-md p-2">
                  <Input
                    id="resume"
                    name="resume"
                    type="file"
                    accept=".pdf,.docx"
                    onChange={(e) => handleFileChange(e, "resume")}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {resumeFile ? resumeFile.name : "No file selected"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
                <div className="border rounded-md p-2">
                  <Input
                    id="coverLetter"
                    name="coverLetter"
                    type="file"
                    accept=".pdf,.docx"
                    onChange={(e) => handleFileChange(e, "coverLetter")}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {coverLetterFile
                      ? coverLetterFile.name
                      : "No file selected"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalInfo">
                  Additional Information (Optional)
                </Label>
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  rows={4}
                  className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Share any additional information about yourself that you would like the employer to know"
                  value={applicationForm.additionalInfo}
                  onChange={handleFormChange}
                />
              </div>
            </div>

            <DialogFooter>
              <div className="flex flex-col sm:flex-row w-full gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowApplyForm(false)}
                  className="sm:flex-1"
                >
                  Cancel
                </Button>
                <Button onClick={handleApplySubmit} className="sm:flex-1">
                  Submit Application
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Application Details Dialog */}
        <Dialog
          open={showApplicationDetails}
          onOpenChange={setShowApplicationDetails}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedApplication && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-12 h-12 rounded overflow-hidden bg-primary/10 flex items-center justify-center">
                      <img
                        src={selectedApplication.listing?.logo}
                        alt={`${selectedApplication.listing?.company} logo`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <DialogTitle>
                        {selectedApplication.listing?.title}
                      </DialogTitle>
                      <DialogDescription>
                        {selectedApplication.listing?.company}
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant={
                        selectedApplication.status === "submitted"
                          ? "outline"
                          : selectedApplication.status === "interview"
                          ? "default"
                          : selectedApplication.status === "offer"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {selectedApplication.status === "submitted"
                        ? "Applied"
                        : selectedApplication.status === "interview"
                        ? "Interview"
                        : selectedApplication.status === "offer"
                        ? "Offer"
                        : "Rejected"}
                    </Badge>

                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <Calendar className="h-3 w-3" />
                      Applied on{" "}
                      {new Date(
                        selectedApplication.appliedDate
                      ).toLocaleDateString()}
                    </Badge>
                  </div>

                  <div className="border rounded-md p-4 space-y-4">
                    <h4 className="font-medium mb-2">Application Details</h4>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Position:</p>
                        <p className="font-medium">
                          {selectedApplication.listing?.title}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Company:</p>
                        <p className="font-medium">
                          {selectedApplication.listing?.company}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Location:</p>
                        <p className="font-medium">
                          {selectedApplication.listing?.location}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Job Type:</p>
                        <p className="font-medium">
                          {selectedApplication.listing?.type === "internship"
                            ? "Internship"
                            : selectedApplication.listing?.type === "part-time"
                            ? "Part-time"
                            : "Full-time"}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Status:</p>
                        <p className="font-medium">
                          {selectedApplication.status === "submitted"
                            ? "Applied"
                            : selectedApplication.status === "interview"
                            ? "Interview"
                            : selectedApplication.status === "offer"
                            ? "Offer"
                            : "Rejected"}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Applied Date:</p>
                        <p className="font-medium">
                          {new Date(
                            selectedApplication.appliedDate
                          ).toLocaleDateString()}
                        </p>
                      </div>

                      {selectedApplication.status === "interview" && (
                        <>
                          <div>
                            <p className="text-muted-foreground">
                              Interview Date:
                            </p>
                            <p className="font-medium">
                              {new Date(
                                selectedApplication.interviewDate || ""
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">
                              Interview Time:
                            </p>
                            <p className="font-medium">
                              {selectedApplication.interviewTime}
                            </p>
                          </div>
                        </>
                      )}
                    </div>

                    {selectedApplication.notes && (
                      <div className="space-y-2">
                        <p className="text-muted-foreground">Notes:</p>
                        <p className="text-sm">{selectedApplication.notes}</p>
                      </div>
                    )}

                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-2">Documents</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-2 border rounded-md">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-primary" />
                            <span>Resume.pdf</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex justify-between items-center p-2 border rounded-md">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-primary" />
                            <span>Cover Letter.pdf</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <div className="flex flex-col sm:flex-row w-full gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowApplicationDetails(false)}
                      className="sm:flex-1"
                    >
                      Close
                    </Button>
                    <Button
                      variant="default"
                      className="sm:flex-1"
                      onClick={() => {
                        // Update status for demo purposes
                        const newStatus =
                          selectedApplication.status === "submitted"
                            ? "interview"
                            : selectedApplication.status === "interview"
                            ? "offer"
                            : "submitted";

                        // Update application in state
                        setApplications((prev) =>
                          prev.map((app) =>
                            app.id === selectedApplication.id
                              ? {
                                  ...app,
                                  status: newStatus,
                                  lastUpdated: new Date()
                                    .toISOString()
                                    .split("T")[0],
                                }
                              : app
                          )
                        );

                        // Close dialog
                        setShowApplicationDetails(false);

                        // Show success notification
                        toast.success("Application status updated", {
                          description: `Status changed to ${
                            newStatus === "submitted"
                              ? "Applied"
                              : newStatus === "interview"
                              ? "Interview"
                              : "Offer"
                          }`,
                        });
                      }}
                    >
                      Update Status
                    </Button>
                  </div>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Internships;

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useApp } from "@/contexts/AppContext";
import { toast } from "@/components/ui/sonner";
import {
  BookOpen,
  FileText,
  Video,
  Download,
  Bookmark,
  Search,
  Filter,
  ExternalLink,
  Calendar,
  LucideIcon,
  FolderOpen,
  BookMarked,
  Calculator,
  Globe,
  Lightbulb,
  History,
  Dna,
  PaintBucket,
  Languages,
  Compass,
  Binary,
  Music,
  Dumbbell,
} from "lucide-react";

// Types
interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  subject: string;
  type: "document" | "video" | "quiz" | "interactive" | "practice";
  level: "beginner" | "intermediate" | "advanced";
  downloadable: boolean;
  thumbnail: string;
  dateAdded: string;
  tags: string[];
  isBookmarked: boolean;
}

// Initialize IndexedDB for resources
const initializeDB = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open("SchoolVerseDB", 3);

    request.onerror = (event) => {
      console.error("Error opening IndexedDB:", event);
      reject("Error opening database");
    };

    request.onupgradeneeded = (event) => {
      const db = request.result;

      // Create resources store if it doesn't exist
      if (!db.objectStoreNames.contains("resources")) {
        const resourcesStore = db.createObjectStore("resources", {
          keyPath: "id",
        });
        resourcesStore.createIndex("subject", "subject", { unique: false });
        resourcesStore.createIndex("type", "type", { unique: false });
      }

      // Create bookmarked resources store if it doesn't exist
      if (!db.objectStoreNames.contains("bookmarkedResources")) {
        const bookmarksStore = db.createObjectStore("bookmarkedResources", {
          keyPath: "resourceId",
        });
        bookmarksStore.createIndex("userId", "userId", { unique: false });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };
  });
};

// Helper function to access resources store
const getResourcesStore = async (mode: IDBTransactionMode = "readonly") => {
  const db = await initializeDB();
  const transaction = db.transaction("resources", mode);
  return transaction.objectStore("resources");
};

// Helper function to access bookmarked resources store
const getBookmarkedResourcesStore = async (
  mode: IDBTransactionMode = "readonly"
) => {
  const db = await initializeDB();
  const transaction = db.transaction("bookmarkedResources", mode);
  return transaction.objectStore("bookmarkedResources");
};

// Get all resources
const getAllResources = async (): Promise<Resource[]> => {
  const store = await getResourcesStore();
  return new Promise((resolve, reject) => {
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = (event) => {
      console.error("Error getting resources:", event);
      reject([]);
    };
  });
};

// Get user's bookmarked resources
const getBookmarkedResources = async (userId: string): Promise<string[]> => {
  const store = await getBookmarkedResourcesStore();
  const index = store.index("userId");

  return new Promise((resolve, reject) => {
    const request = index.getAll(userId);

    request.onsuccess = () => {
      const bookmarks = request.result.map((bookmark) => bookmark.resourceId);
      resolve(bookmarks);
    };

    request.onerror = (event) => {
      console.error("Error getting bookmarked resources:", event);
      reject([]);
    };
  });
};

// Toggle bookmark for a resource
const toggleBookmark = async (
  resourceId: string,
  userId: string,
  isBookmarked: boolean
) => {
  const store = await getBookmarkedResourcesStore("readwrite");

  return new Promise<void>((resolve, reject) => {
    if (isBookmarked) {
      // Add bookmark
      const bookmark = {
        resourceId,
        userId,
        dateAdded: new Date().toISOString(),
      };

      const request = store.add(bookmark);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (event) => {
        console.error("Error adding bookmark:", event);
        reject();
      };
    } else {
      // Remove bookmark
      const request = store.delete(resourceId);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (event) => {
        console.error("Error removing bookmark:", event);
        reject();
      };
    }
  });
};

// Sample resources data
const sampleResources: Resource[] = [
  {
    id: "1",
    title: "AP Calculus Complete Study Guide",
    description:
      "Comprehensive study guide covering all AP Calculus AB and BC topics, with practice problems and solutions.",
    url: "https://example.com/calculus-guide",
    subject: "Mathematics",
    type: "document",
    level: "advanced",
    downloadable: true,
    thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",
    dateAdded: "2023-06-15T10:00:00Z",
    tags: ["Calculus", "AP", "Study Guide"],
    isBookmarked: false,
  },
  {
    id: "2",
    title: "Biology Cell Structure Interactive Lab",
    description:
      "Virtual lab allowing students to explore cell structures and functions with interactive 3D models.",
    url: "https://example.com/cell-lab",
    subject: "Science",
    type: "interactive",
    level: "intermediate",
    downloadable: false,
    thumbnail: "https://images.unsplash.com/photo-1530973428-5bf2db2e4d71",
    dateAdded: "2023-07-22T14:30:00Z",
    tags: ["Biology", "Cells", "Virtual Lab"],
    isBookmarked: true,
  },
  {
    id: "3",
    title: "World History: Ancient Civilizations Video Series",
    description:
      "10-part video series exploring ancient civilizations around the world, their contributions, and their impact on modern society.",
    url: "https://example.com/ancient-civilizations",
    subject: "History",
    type: "video",
    level: "beginner",
    downloadable: false,
    thumbnail: "https://images.unsplash.com/photo-1564419320461-6870880221ad",
    dateAdded: "2023-05-10T09:15:00Z",
    tags: ["History", "Ancient Civilizations", "Video Series"],
    isBookmarked: false,
  },
  {
    id: "4",
    title: "English Literature Essay Writing Guide",
    description:
      "Step-by-step guide to writing analytical essays for English literature, with sample essays and grading rubrics.",
    url: "https://example.com/essay-guide",
    subject: "English",
    type: "document",
    level: "intermediate",
    downloadable: true,
    thumbnail: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d",
    dateAdded: "2023-08-05T16:20:00Z",
    tags: ["English", "Essay Writing", "Literature"],
    isBookmarked: false,
  },
  {
    id: "5",
    title: "AP Physics Practice Exam",
    description:
      "Full-length practice exam for AP Physics 1 with answer key and detailed explanations.",
    url: "https://example.com/physics-exam",
    subject: "Science",
    type: "quiz",
    level: "advanced",
    downloadable: true,
    thumbnail: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa",
    dateAdded: "2023-04-18T11:40:00Z",
    tags: ["Physics", "AP", "Practice Exam"],
    isBookmarked: true,
  },
  {
    id: "6",
    title: "Spanish Conversation Practice",
    description:
      "Interactive conversation practice for Spanish learners, with realistic dialogues and pronunciation guidance.",
    url: "https://example.com/spanish-practice",
    subject: "Languages",
    type: "interactive",
    level: "beginner",
    downloadable: false,
    thumbnail: "https://images.unsplash.com/photo-1633408902183-e4935c0ba601",
    dateAdded: "2023-09-12T13:25:00Z",
    tags: ["Spanish", "Language Learning", "Conversation"],
    isBookmarked: false,
  },
  {
    id: "7",
    title: "Computer Science: Introduction to Algorithms",
    description:
      "Comprehensive guide to fundamental algorithms and data structures, with code examples in Python and Java.",
    url: "https://example.com/algorithms-intro",
    subject: "Computer Science",
    type: "document",
    level: "intermediate",
    downloadable: true,
    thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c",
    dateAdded: "2023-03-30T15:10:00Z",
    tags: ["Computer Science", "Algorithms", "Programming"],
    isBookmarked: false,
  },
  {
    id: "8",
    title: "Art History: Renaissance Masters",
    description:
      "Video lectures on Renaissance art, covering major artists, techniques, and historical context.",
    url: "https://example.com/renaissance-art",
    subject: "Arts",
    type: "video",
    level: "intermediate",
    downloadable: false,
    thumbnail: "https://images.unsplash.com/photo-1577083552782-4515a28e1785",
    dateAdded: "2023-07-05T10:50:00Z",
    tags: ["Art History", "Renaissance", "Video Lectures"],
    isBookmarked: false,
  },
  {
    id: "9",
    title: "SAT Math Prep Course",
    description:
      "Complete preparation course for the math section of the SAT, with strategies, practice problems, and mock tests.",
    url: "https://example.com/sat-math",
    subject: "Mathematics",
    type: "practice",
    level: "intermediate",
    downloadable: true,
    thumbnail: "https://images.unsplash.com/photo-1635241161466-541f065683ba",
    dateAdded: "2023-06-28T09:30:00Z",
    tags: ["SAT", "Math", "Test Prep"],
    isBookmarked: false,
  },
  {
    id: "10",
    title: "Geography: Climate Change Interactive Maps",
    description:
      "Interactive maps and visualizations showing climate change impacts around the world, with data analysis tools.",
    url: "https://example.com/climate-maps",
    subject: "Geography",
    type: "interactive",
    level: "intermediate",
    downloadable: false,
    thumbnail: "https://images.unsplash.com/photo-1569974612836-cb35ec65118c",
    dateAdded: "2023-05-20T14:15:00Z",
    tags: ["Geography", "Climate Change", "Interactive Maps"],
    isBookmarked: true,
  },
];

// Map subject to icon
const subjectIcons: Record<string, LucideIcon> = {
  Mathematics: Calculator,
  Science: Dna,
  History: History,
  English: BookOpen,
  Languages: Languages,
  "Computer Science": Binary,
  Arts: PaintBucket,
  Geography: Globe,
  "Physical Education": Dumbbell,
  Music: Music,
};

// Map resource type to icon
const resourceTypeIcons: Record<string, LucideIcon> = {
  document: FileText,
  video: Video,
  interactive: Compass,
  quiz: FileText,
  practice: Lightbulb,
};

const Resources = () => {
  const { currentUser } = useApp();
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [activeSubject, setActiveSubject] = useState("all");
  const [activeType, setActiveType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [dbInitialized, setDbInitialized] = useState(false);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        await initializeDB();
        setDbInitialized(true);

        // Try to load from IndexedDB
        const resourceItems = await getAllResources();

        // If no resources found, seed with sample data
        if (resourceItems.length === 0) {
          console.log("No resources found, seeding with sample data");
          const store = await getResourcesStore("readwrite");
          sampleResources.forEach((item) => {
            store.add(item);
          });
          setResources(sampleResources);
          setFilteredResources(sampleResources);
        } else {
          // Load user's bookmarks
          const bookmarkedIds = await getBookmarkedResources(
            currentUser?.id || ""
          );

          // Mark resources as bookmarked
          const resourcesWithBookmarks = resourceItems.map((resource) => ({
            ...resource,
            isBookmarked: bookmarkedIds.includes(resource.id),
          }));

          setResources(resourcesWithBookmarks);
          setFilteredResources(resourcesWithBookmarks);
        }
      } catch (error) {
        console.error("Error loading resources data:", error);
        // Fall back to sample data
        setResources(sampleResources);
        setFilteredResources(sampleResources);
      }
    };

    loadData();
  }, [currentUser?.id]);

  // Filter and search resources
  useEffect(() => {
    let results = [...resources];

    // Filter by subject
    if (activeSubject !== "all") {
      results = results.filter(
        (resource) => resource.subject === activeSubject
      );
    }

    // Filter by type
    if (activeType !== "all") {
      results = results.filter((resource) => resource.type === activeType);
    }

    // Filter bookmarked
    if (showBookmarked) {
      results = results.filter((resource) => resource.isBookmarked);
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (resource) =>
          resource.title.toLowerCase().includes(query) ||
          resource.description.toLowerCase().includes(query) ||
          resource.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    setFilteredResources(results);
  }, [activeSubject, activeType, showBookmarked, searchQuery, resources]);

  // Toggle bookmark
  const handleToggleBookmark = async (resourceId: string) => {
    if (!currentUser) {
      toast.error("You must be logged in to bookmark resources");
      return;
    }

    try {
      // Update state optimistically
      const updatedResources = resources.map((resource) =>
        resource.id === resourceId
          ? { ...resource, isBookmarked: !resource.isBookmarked }
          : resource
      );

      setResources(updatedResources);

      // Find the resource
      const resource = resources.find((r) => r.id === resourceId);

      if (!resource) return;

      // Update in database
      if (dbInitialized) {
        await toggleBookmark(
          resourceId,
          currentUser.id,
          !resource.isBookmarked
        );
      }

      toast.success(
        resource.isBookmarked
          ? "Resource removed from bookmarks"
          : "Resource added to bookmarks"
      );
    } catch (error) {
      console.error("Error toggling bookmark:", error);

      // Revert state change on error
      setResources((prevResources) => [...prevResources]);

      toast.error("Failed to update bookmark");
    }
  };

  // Get unique subjects from resources
  const subjects = Array.from(
    new Set(resources.map((resource) => resource.subject))
  ).sort();

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get icon for subject
  const getSubjectIcon = (subject: string) => {
    const Icon = subjectIcons[subject] || BookOpen;
    return <Icon className="h-5 w-5" />;
  };

  // Get icon for resource type
  const getTypeIcon = (type: string) => {
    const Icon = resourceTypeIcons[type] || FileText;
    return <Icon className="h-5 w-5" />;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold gradient-text">
            Study Resources Hub
          </h1>
          <p className="text-muted-foreground">
            Access learning materials, practice tests, and interactive content
            to enhance your learning
          </p>
        </div>

        {/* Search and filter controls */}
        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant={showBookmarked ? "default" : "outline"}
              size="sm"
              className="gap-1"
              onClick={() => setShowBookmarked(!showBookmarked)}
            >
              <Bookmark
                className={`h-4 w-4 ${showBookmarked ? "fill-current" : ""}`}
              />
              <span>Bookmarked</span>
            </Button>
          </div>
        </div>

        {/* Subject tabs */}
        <Tabs defaultValue="all" onValueChange={setActiveSubject}>
          <ScrollArea className="w-full whitespace-nowrap pb-2">
            <TabsList className="w-max px-1">
              <TabsTrigger value="all" className="gap-1">
                <FolderOpen className="h-4 w-4" />
                <span>All Subjects</span>
              </TabsTrigger>

              {subjects.map((subject) => (
                <TabsTrigger key={subject} value={subject} className="gap-1">
                  {getSubjectIcon(subject)}
                  <span>{subject}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </ScrollArea>

          {/* Resource type filter */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge
              variant={activeType === "all" ? "default" : "outline"}
              className="cursor-pointer py-1 px-3"
              onClick={() => setActiveType("all")}
            >
              All Types
            </Badge>
            <Badge
              variant={activeType === "document" ? "default" : "outline"}
              className="cursor-pointer py-1 px-3"
              onClick={() => setActiveType("document")}
            >
              Documents
            </Badge>
            <Badge
              variant={activeType === "video" ? "default" : "outline"}
              className="cursor-pointer py-1 px-3"
              onClick={() => setActiveType("video")}
            >
              Videos
            </Badge>
            <Badge
              variant={activeType === "interactive" ? "default" : "outline"}
              className="cursor-pointer py-1 px-3"
              onClick={() => setActiveType("interactive")}
            >
              Interactive
            </Badge>
            <Badge
              variant={activeType === "quiz" ? "default" : "outline"}
              className="cursor-pointer py-1 px-3"
              onClick={() => setActiveType("quiz")}
            >
              Quizzes
            </Badge>
            <Badge
              variant={activeType === "practice" ? "default" : "outline"}
              className="cursor-pointer py-1 px-3"
              onClick={() => setActiveType("practice")}
            >
              Practice
            </Badge>
          </div>

          {/* Content area */}
          <TabsContent value="all" className="mt-6">
            <div className="grid gap-4">
              {filteredResources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  onToggleBookmark={handleToggleBookmark}
                  formatDate={formatDate}
                  getTypeIcon={getTypeIcon}
                />
              ))}

              {filteredResources.length === 0 && (
                <div className="text-center p-16 border rounded-lg bg-background">
                  <BookOpen className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                  <h3 className="mt-4 text-lg font-medium">
                    No resources found
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {searchQuery
                      ? "Try adjusting your search criteria"
                      : showBookmarked
                      ? "You haven't bookmarked any resources yet"
                      : activeSubject !== "all"
                      ? `No resources available for ${activeSubject}`
                      : "No resources match your filters"}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Create a tab content for each subject */}
          {subjects.map((subject) => (
            <TabsContent key={subject} value={subject} className="mt-6">
              <div className="grid gap-4">
                {filteredResources.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    onToggleBookmark={handleToggleBookmark}
                    formatDate={formatDate}
                    getTypeIcon={getTypeIcon}
                  />
                ))}

                {filteredResources.length === 0 && (
                  <div className="text-center p-16 border rounded-lg bg-background">
                    <BookOpen className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                    <h3 className="mt-4 text-lg font-medium">
                      No resources found
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {searchQuery
                        ? "Try adjusting your search criteria"
                        : showBookmarked
                        ? `You haven't bookmarked any ${subject} resources`
                        : `No ${subject} resources match your filters`}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

// Resource card component
interface ResourceCardProps {
  resource: Resource;
  onToggleBookmark: (id: string) => void;
  formatDate: (date: string) => string;
  getTypeIcon: (type: string) => JSX.Element;
}

const ResourceCard = ({
  resource,
  onToggleBookmark,
  formatDate,
  getTypeIcon,
}: ResourceCardProps) => {
  // Get level badge color
  const getLevelBadge = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "intermediate":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "advanced":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/4 lg:w-1/5 h-40 md:h-auto bg-muted flex-shrink-0">
          <img
            src={resource.thumbnail}
            alt={resource.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="md:w-3/4 lg:w-4/5 flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl">{resource.title}</CardTitle>
                <CardDescription className="flex items-center gap-1 mt-1">
                  {getTypeIcon(resource.type)}
                  <span className="capitalize">{resource.type}</span>
                  <span className="mx-1">•</span>
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(resource.dateAdded)}</span>
                </CardDescription>
              </div>

              <div className="flex items-center gap-2">
                <Badge className={getLevelBadge(resource.level)}>
                  {resource.level.charAt(0).toUpperCase() +
                    resource.level.slice(1)}
                </Badge>

                {resource.downloadable && (
                  <Badge variant="outline" className="gap-1">
                    <Download className="h-3 w-3" />
                    <span>Downloadable</span>
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="py-2 flex-1">
            <p className="text-sm text-muted-foreground">
              {resource.description}
            </p>

            <div className="flex flex-wrap gap-1.5 mt-3">
              {resource.tags.map((tag, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>

          <CardFooter className="border-t pt-3 flex justify-between">
            <Button variant="outline" size="sm" className="gap-1" asChild>
              <a href={resource.url} target="_blank" rel="noopener noreferrer">
                <span>Open Resource</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={`gap-1 ${resource.isBookmarked ? "text-primary" : ""}`}
              onClick={() => onToggleBookmark(resource.id)}
            >
              <Bookmark
                className={`h-4 w-4 ${
                  resource.isBookmarked ? "fill-current" : ""
                }`}
              />
              <span>{resource.isBookmarked ? "Bookmarked" : "Bookmark"}</span>
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

export default Resources;

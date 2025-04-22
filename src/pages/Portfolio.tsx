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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useApp } from "@/contexts/AppContext";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import {
  Briefcase,
  Award,
  Users,
  Plus,
  Image,
  Trash2,
  Edit2,
  Heart,
  MessageSquare,
  Share2,
  Upload,
  Filter,
  Search,
  BookOpen,
} from "lucide-react";

// Types
interface PortfolioItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  tags: string[];
  createdAt: string;
  likes: number;
  comments: number;
  isLiked: boolean;
}

// Initialize IndexedDB for portfolio items
const initializeDB = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open("SchoolVerseDB", 2);

    request.onerror = (event) => {
      console.error("Error opening IndexedDB:", event);
      reject("Error opening database");
    };

    request.onupgradeneeded = (event) => {
      const db = request.result;

      // Create portfolio store if it doesn't exist
      if (!db.objectStoreNames.contains("portfolioItems")) {
        const portfolioStore = db.createObjectStore("portfolioItems", {
          keyPath: "id",
        });
        portfolioStore.createIndex("userId", "userId", { unique: false });
        portfolioStore.createIndex("category", "category", { unique: false });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };
  });
};

// Helper function to access portfolio store
const getPortfolioStore = async (mode: IDBTransactionMode = "readonly") => {
  const db = await initializeDB();
  const transaction = db.transaction("portfolioItems", mode);
  return transaction.objectStore("portfolioItems");
};

// Get all portfolio items
const getAllPortfolioItems = async (): Promise<PortfolioItem[]> => {
  const store = await getPortfolioStore();
  return new Promise((resolve, reject) => {
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = (event) => {
      console.error("Error getting portfolio items:", event);
      reject([]);
    };
  });
};

// Add a new portfolio item
const addPortfolioItem = async (
  item: Omit<PortfolioItem, "id" | "createdAt">
) => {
  const store = await getPortfolioStore("readwrite");

  const newItem: PortfolioItem = {
    ...item,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };

  return new Promise<string>((resolve, reject) => {
    const request = store.add(newItem);

    request.onsuccess = () => {
      resolve(newItem.id);
    };

    request.onerror = (event) => {
      console.error("Error adding portfolio item:", event);
      reject("Failed to add item");
    };
  });
};

// Delete a portfolio item
const deletePortfolioItem = async (id: string) => {
  const store = await getPortfolioStore("readwrite");

  return new Promise<void>((resolve, reject) => {
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event) => {
      console.error("Error deleting portfolio item:", event);
      reject("Failed to delete item");
    };
  });
};

// Sample data categories
const categories = [
  {
    name: "Academic",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  },
  {
    name: "Art",
    color:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  },
  {
    name: "Technology",
    color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
  },
  {
    name: "Sports",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  },
  {
    name: "Leadership",
    color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
  },
  {
    name: "Volunteering",
    color: "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300",
  },
];

// Sample data for portfolio showcases
const sampleProjects: PortfolioItem[] = [
  {
    id: "1",
    userId: "1",
    userName: "Jane Doe",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    title: "Solar System 3D Model",
    description:
      "Created a detailed 3D model of the solar system for the science fair, showing the relative sizes and orbits of all planets. Won first place in the physics category.",
    imageUrl:
      "https://images.unsplash.com/photo-1614642264762-d0a3b8bf3700?q=80&w=1000",
    category: "Academic",
    tags: ["Science", "Physics", "3D Modeling"],
    createdAt: "2023-02-15T12:00:00Z",
    likes: 24,
    comments: 5,
    isLiked: false,
  },
  {
    id: "2",
    userId: "2",
    userName: "Mark Johnson",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mark",
    title: "Digital Landscape Painting",
    description:
      "My submission for the annual digital arts competition. I was inspired by the landscapes of Iceland and used ProCreate to create this digital painting.",
    imageUrl:
      "https://images.unsplash.com/photo-1619693859312-8d9e1babd461?q=80&w=1000",
    category: "Art",
    tags: ["Digital Art", "Landscape", "ProCreate"],
    createdAt: "2023-03-22T15:30:00Z",
    likes: 47,
    comments: 12,
    isLiked: true,
  },
  {
    id: "3",
    userId: "3",
    userName: "Sara Williams",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara",
    title: "Web App for Local Food Bank",
    description:
      "Developed a web application for our local food bank to help them manage inventory and coordinate donations. Built using React, Node.js, and MongoDB.",
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000",
    category: "Technology",
    tags: ["Web Development", "React", "Community Service"],
    createdAt: "2023-04-10T09:45:00Z",
    likes: 36,
    comments: 8,
    isLiked: false,
  },
  {
    id: "4",
    userId: "4",
    userName: "Raj Patel",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Raj",
    title: "State Basketball Championship",
    description:
      "Led our school basketball team to the state championship. Averaged 18 points and 7 assists per game throughout the tournament.",
    imageUrl:
      "https://images.unsplash.com/photo-1518063319789-7217e6706b04?q=80&w=1000",
    category: "Sports",
    tags: ["Basketball", "Championship", "Team Captain"],
    createdAt: "2023-05-05T18:20:00Z",
    likes: 52,
    comments: 15,
    isLiked: false,
  },
  {
    id: "5",
    userId: "1",
    userName: "Jane Doe",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    title: "Student Council President",
    description:
      "Elected as Student Council President for the 2023-2024 school year. Implemented a new student mentorship program and organized the largest fundraiser in school history.",
    imageUrl:
      "https://images.unsplash.com/photo-1544047963-2f48132572d1?q=80&w=1000",
    category: "Leadership",
    tags: ["Student Council", "Leadership", "Public Speaking"],
    createdAt: "2023-06-12T14:10:00Z",
    likes: 41,
    comments: 9,
    isLiked: true,
  },
];

const Portfolio = () => {
  const { currentUser } = useApp();
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<PortfolioItem[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    imageUrl: "",
    category: "",
    tags: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [dbInitialized, setDbInitialized] = useState(false);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        await initializeDB();
        setDbInitialized(true);

        // Try to load from IndexedDB
        const items = await getAllPortfolioItems();

        // If no items found, seed with sample data
        if (items.length === 0) {
          console.log("No portfolio items found, seeding with sample data");
          const store = await getPortfolioStore("readwrite");
          sampleProjects.forEach((item) => {
            store.add(item);
          });
          setPortfolioItems(sampleProjects);
          setFilteredItems(sampleProjects);
        } else {
          setPortfolioItems(items);
          setFilteredItems(items);
        }
      } catch (error) {
        console.error("Error loading portfolio data:", error);
        // Fall back to sample data
        setPortfolioItems(sampleProjects);
        setFilteredItems(sampleProjects);
      }
    };

    loadData();
  }, []);

  // Filter and search handler
  useEffect(() => {
    let results = [...portfolioItems];

    // Apply category filter
    if (activeFilter !== "all") {
      results = results.filter((item) => item.category === activeFilter);
    }

    // Apply search if any
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    setFilteredItems(results);
  }, [activeFilter, searchQuery, portfolioItems]);

  // Handle form submission for new portfolio item
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newItem.title || !newItem.description || !newItem.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      // Prepare the new item
      const itemToAdd: Omit<PortfolioItem, "id" | "createdAt"> = {
        userId: currentUser?.id || "unknown",
        userName: currentUser?.name || "Unknown User",
        userAvatar:
          currentUser?.avatar ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
        title: newItem.title,
        description: newItem.description,
        imageUrl:
          newItem.imageUrl ||
          "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000", // Default image
        category: newItem.category,
        tags: newItem.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag !== ""),
        likes: 0,
        comments: 0,
        isLiked: false,
      };

      // Add to database
      if (dbInitialized) {
        const newId = await addPortfolioItem(itemToAdd);
        console.log("Added new portfolio item with ID:", newId);

        // Add to state with the generated ID
        const completeItem: PortfolioItem = {
          ...itemToAdd,
          id: newId,
          createdAt: new Date().toISOString(),
        };

        setPortfolioItems((prev) => [completeItem, ...prev]);
      } else {
        // Fallback if DB isn't initialized
        const mockItem: PortfolioItem = {
          ...itemToAdd,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };

        setPortfolioItems((prev) => [mockItem, ...prev]);
      }

      // Reset form and close dialog
      setNewItem({
        title: "",
        description: "",
        imageUrl: "",
        category: "",
        tags: "",
      });
      setShowAddDialog(false);
      toast.success("Portfolio item added successfully!");
    } catch (error) {
      console.error("Error adding portfolio item:", error);
      toast.error("Failed to add portfolio item");
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle like
  const handleToggleLike = (id: string) => {
    setPortfolioItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              isLiked: !item.isLiked,
              likes: item.isLiked ? item.likes - 1 : item.likes + 1,
            }
          : item
      )
    );
  };

  // Delete item
  const handleDelete = async (id: string) => {
    try {
      if (dbInitialized) {
        await deletePortfolioItem(id);
      }

      setPortfolioItems((prev) => prev.filter((item) => item.id !== id));
      toast.success("Portfolio item deleted successfully");
    } catch (error) {
      console.error("Error deleting portfolio item:", error);
      toast.error("Failed to delete portfolio item");
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold gradient-text mt-4 md:mt-0">
              Digital Portfolio
            </h1>
            <p className="text-muted-foreground">
              Showcase your achievements, projects, and skills to peers and
              colleges
            </p>
          </div>

          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                <span>Add Portfolio Item</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Add New Portfolio Item</DialogTitle>
                <DialogDescription>
                  Showcase your work, achievements or extracurricular activities
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newItem.title}
                      onChange={(e) =>
                        setNewItem({ ...newItem, title: e.target.value })
                      }
                      placeholder="Project or achievement title"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      value={newItem.category}
                      onChange={(e) =>
                        setNewItem({ ...newItem, category: e.target.value })
                      }
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat.name} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newItem.description}
                      onChange={(e) =>
                        setNewItem({ ...newItem, description: e.target.value })
                      }
                      placeholder="Describe your project, achievement or activity"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input
                      id="imageUrl"
                      value={newItem.imageUrl}
                      onChange={(e) =>
                        setNewItem({ ...newItem, imageUrl: e.target.value })
                      }
                      placeholder="Link to image (optional)"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      value={newItem.tags}
                      onChange={(e) =>
                        setNewItem({ ...newItem, tags: e.target.value })
                      }
                      placeholder="Comma-separated tags (e.g., Science, Art, Leadership)"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Save & Publish
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search portfolios..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Desktop tabs */}
          <div className="hidden md:block">
            <Tabs
              defaultValue="all"
              className="w-full"
              onValueChange={setActiveFilter}
            >
              <TabsList className="grid grid-cols-7">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="Academic">Academic</TabsTrigger>
                <TabsTrigger value="Art">Art</TabsTrigger>
                <TabsTrigger value="Technology">Tech</TabsTrigger>
                <TabsTrigger value="Sports">Sports</TabsTrigger>
                <TabsTrigger value="Leadership">Leadership</TabsTrigger>
                <TabsTrigger value="Volunteering">Volunteering</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Mobile scrollable filter tabs */}
          <div className="md:hidden">
            <div className="overflow-x-auto no-scrollbar pb-1 relative">
              <div className="flex min-w-max">
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    activeFilter === "all"
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setActiveFilter("all")}
                >
                  All
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    activeFilter === "Academic"
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setActiveFilter("Academic")}
                >
                  Academic
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    activeFilter === "Art"
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setActiveFilter("Art")}
                >
                  Art
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    activeFilter === "Technology"
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setActiveFilter("Technology")}
                >
                  Tech
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    activeFilter === "Sports"
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setActiveFilter("Sports")}
                >
                  Sports
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    activeFilter === "Leadership"
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setActiveFilter("Leadership")}
                >
                  Leadership
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    activeFilter === "Volunteering"
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setActiveFilter("Volunteering")}
                >
                  Volunteering
                </button>
              </div>
              {/* Scroll indicator - subtle gradient on right edge */}
              <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>

        {/* Portfolio grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            // Get category color
            const category = categories.find((c) => c.name === item.category);
            const categoryColor =
              category?.color ||
              "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";

            // Is this the current user's item?
            const isOwner = item.userId === currentUser?.id;

            return (
              <Card
                key={item.id}
                className="overflow-hidden flex flex-col h-full"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                  <Badge className={`absolute top-2 right-2 ${categoryColor}`}>
                    {item.category}
                  </Badge>
                </div>

                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                    {isOwner && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground -mt-1 -mr-2"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full overflow-hidden">
                      <img
                        src={item.userAvatar}
                        alt={item.userName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardDescription className="text-xs">
                      {item.userName} • {formatDate(item.createdAt)}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="py-2 flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {item.tags.map((tag, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="flex justify-between pt-2 border-t">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`p-1 ${
                        item.isLiked ? "text-red-500" : "text-muted-foreground"
                      }`}
                      onClick={() => handleToggleLike(item.id)}
                    >
                      <Heart className="h-4 w-4 mr-1 fill-current" />
                      <span>{item.likes}</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 text-muted-foreground"
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      <span>{item.comments}</span>
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 text-muted-foreground"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center p-16 border rounded-lg bg-background">
            <Briefcase className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
            <h3 className="mt-4 text-lg font-medium">
              No portfolio items found
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {searchQuery
                ? "Try adjusting your search criteria"
                : activeFilter !== "all"
                ? `No items in the ${activeFilter} category`
                : "Add your first portfolio item to showcase your work"}
            </p>
            <Button className="mt-4" onClick={() => setShowAddDialog(true)}>
              Add Portfolio Item
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Portfolio;

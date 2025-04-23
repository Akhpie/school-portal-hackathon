import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Book,
  Calendar,
  MessageSquare,
  Heart,
  Settings,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Bell,
  FileText,
  LogOut,
  Briefcase,
  BookOpen,
  Compass,
  ChevronDown,
  UserRound,
  Presentation,
  Folder,
  MessageCircle,
  Menu,
  Gamepad,
  MedalIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useApp } from "@/contexts/AppContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

// Single item interface for dashboard and settings
interface NavItem {
  icon: any;
  label: string;
  path: string;
}

// Category definition for grouped navigation
interface NavCategory {
  id: string;
  label: string;
  icon: any;
  items: NavItem[];
}

// Dashboard standalone nav item at the top
const dashboardNavItem: NavItem = {
  icon: LayoutDashboard,
  label: "Dashboard",
  path: "/dashboard",
};

// Settings standalone nav item at the bottom
const settingsNavItem: NavItem = {
  icon: Settings,
  label: "Settings",
  path: "/settings",
};

const GamesNavItem: NavItem = {
  icon: Gamepad,
  label: "Games",
  path: "/games",
};
const RewardsNavItem: NavItem = {
  icon: MedalIcon,
  label: "Redeem",
  path: "/rewards",
};

// Categories for grouped nav items
const navCategories: NavCategory[] = [
  {
    id: "academics",
    label: "Academics",
    icon: GraduationCap,
    items: [
      { icon: Book, label: "Courses", path: "/courses" },
      { icon: GraduationCap, label: "Grades", path: "/grades" },
      { icon: FileText, label: "Assignments", path: "/assignments" },
    ],
  },
  {
    id: "planning",
    label: "Planning",
    icon: Presentation,
    items: [
      { icon: Calendar, label: "Schedule", path: "/schedule" },
      { icon: Compass, label: "Career Pathway", path: "/career-pathway" },
    ],
  },
  {
    id: "opportunities",
    label: "Opportunities",
    icon: Briefcase,
    items: [
      { icon: Briefcase, label: "Internships", path: "/internships" },
      { icon: UserRound, label: "Mentorship", path: "/mentorship" },
    ],
  },
  {
    id: "communication",
    label: "Communication",
    icon: MessageCircle,
    items: [
      { icon: MessageSquare, label: "Messages", path: "/messages" },
      { icon: Bell, label: "Notifications", path: "/notifications" },
    ],
  },
  {
    id: "personal",
    label: "Personal",
    icon: UserRound,
    items: [
      { icon: Heart, label: "Wellness", path: "/wellness" },
      { icon: Briefcase, label: "Portfolio", path: "/portfolio" },
      { icon: BookOpen, label: "Resources", path: "/resources" },
    ],
  },
];

const DashboardSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const location = useLocation();
  const isMobile = useIsMobile();
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();

  // Auto-collapse sidebar based on window width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1180) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // If mobile, always show collapsed sidebar
  const isCollapsed = isMobile || collapsed;

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Auto-expand the category that contains the current route
  // using useEffect or during render
  if (location.pathname !== "/") {
    const currentCategory = navCategories.find((category) =>
      category.items.some((item) => item.path === location.pathname)
    );

    if (currentCategory && !expandedCategories.includes(currentCategory.id)) {
      setExpandedCategories((prev) => [...prev, currentCategory.id]);
    }
  }

  // Render a standalone nav item
  const renderNavItem = (item: NavItem) => (
    <li key={item.label}>
      {isCollapsed ? (
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center justify-center rounded-md h-10 w-10 mx-auto my-2",
                  location.pathname === item.path
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
                aria-label={item.label}
              >
                <item.icon className="h-5 w-5" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">{item.label}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <Link
          to={item.path}
          className={cn(
            "flex items-center rounded-md py-2 px-3 text-sm transition-colors",
            location.pathname === item.path
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
          )}
        >
          <item.icon className="h-5 w-5 mr-2" />
          <span>{item.label}</span>
        </Link>
      )}
    </li>
  );

  // Mobile navigation bar at the bottom
  if (isMobile) {
    return (
      <>
        {/* Full sidebar drawer for mobile */}
        <Drawer>
          <DrawerTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="fixed top-4 right-4 z-50 h-10 w-10 rounded-full"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="h-[90vh] p-0 flex flex-col">
            <div className="flex flex-col h-full overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-primary to-primary/60 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-foreground font-bold text-sm">
                      A
                    </span>
                  </div>
                  <span className="font-bold gradient-text">ARC</span>
                </Link>
              </div>

              <nav className="flex-1 overflow-y-auto pb-4">
                <ul className="space-y-1 px-2 pt-4">
                  {/* Dashboard at the top */}
                  {renderNavItem(dashboardNavItem)}

                  {/* Divider between dashboard and categories */}
                  <li className="my-2">
                    <div className="h-px bg-border mx-1"></div>
                  </li>

                  {/* Categorized items */}
                  {navCategories.map((category) => (
                    <li key={category.id} className="mb-1">
                      <div
                        onClick={() => toggleCategory(category.id)}
                        className={cn(
                          "flex items-center justify-between px-3 py-2 rounded-md cursor-pointer",
                          expandedCategories.includes(category.id)
                            ? "bg-secondary/80 text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <category.icon className="h-5 w-5" />
                          <span className="text-sm font-medium">
                            {category.label}
                          </span>
                        </div>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform",
                            expandedCategories.includes(category.id) &&
                              "transform rotate-180"
                          )}
                        />
                      </div>

                      {/* Category Items */}
                      {expandedCategories.includes(category.id) && (
                        <ul className="mt-1 space-y-1 pl-2">
                          {category.items.map((item) => (
                            <li key={item.label}>
                              <Link
                                to={item.path}
                                className={cn(
                                  "flex items-center rounded-md py-2 px-3 text-sm transition-colors",
                                  location.pathname === item.path
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                                )}
                              >
                                <item.icon className="h-5 w-5 mr-2" />
                                <span>{item.label}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}

                  {/* Divider before settings */}
                  <li className="my-2">
                    <div className="h-px bg-border mx-1"></div>
                  </li>

                  {/* Settings at the bottom */}
                  {renderNavItem(settingsNavItem)}
                  {renderNavItem(RewardsNavItem)}
                  {renderNavItem(GamesNavItem)}
                </ul>
              </nav>

              <div className="p-4 border-t mt-auto">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                      <img
                        src={
                          currentUser?.avatar ||
                          "https://api.dicebear.com/7.x/avataaars/svg?seed=User"
                        }
                        alt="User avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium truncate">
                        {currentUser?.name || "User"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {currentUser?.studentId || ""}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    className="text-muted-foreground hover:text-red-500"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 flex flex-col border-r transition-all duration-300 bg-background",
        isCollapsed ? "w-[70px]" : "w-[240px]"
      )}
    >
      <div className="p-4 border-b flex items-center justify-between">
        <Link
          to="/"
          className={cn(
            "flex items-center gap-2",
            isCollapsed && "justify-center"
          )}
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-r from-primary to-primary/60 flex items-center justify-center flex-shrink-0">
            <span className="text-primary-foreground font-bold text-sm">A</span>
          </div>
          {!isCollapsed && <span className="font-bold gradient-text">ARC</span>}
        </Link>

        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="ml-2"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {/* Dashboard at the top */}
          {renderNavItem(dashboardNavItem)}

          {/* Divider between dashboard and categories */}
          <li className="my-2">
            <div className="h-px bg-border mx-1"></div>
          </li>

          {/* Categorized items */}
          {navCategories.map((category) => (
            <li key={category.id} className="mb-1">
              {/* Category Header */}
              {isCollapsed ? (
                // Collapsed view - show category icon with tooltip and popover
                <Popover>
                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <PopoverTrigger asChild>
                        <TooltipTrigger asChild>
                          <div
                            className={cn(
                              "flex justify-center items-center h-10 w-10 mx-auto my-2 rounded-md cursor-pointer",
                              category.items.some(
                                (item) => item.path === location.pathname
                              )
                                ? "text-primary bg-secondary/50"
                                : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                            )}
                            aria-label={category.label}
                          >
                            <category.icon className="h-5 w-5" />
                          </div>
                        </TooltipTrigger>
                      </PopoverTrigger>
                      <TooltipContent side="right" sideOffset={5}>
                        {category.label}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <PopoverContent
                    side="right"
                    align="start"
                    className="p-1 w-48 border border-border/60 bg-popover/95 backdrop-blur-sm"
                    sideOffset={5}
                  >
                    <div className="py-1 px-2">
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        {category.label}
                      </p>
                    </div>
                    <ul className="space-y-1">
                      {category.items.map((item) => (
                        <li key={item.label} className="px-1">
                          <Link
                            to={item.path}
                            className={cn(
                              "flex items-center rounded-md py-1.5 px-2 text-sm transition-colors",
                              location.pathname === item.path
                                ? "bg-primary text-primary-foreground"
                                : "text-foreground hover:bg-secondary/80"
                            )}
                          >
                            <item.icon className="h-4 w-4 mr-2" />
                            <span>{item.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </PopoverContent>
                </Popover>
              ) : (
                // Expanded view - show collapsible category with items
                <div
                  onClick={() => toggleCategory(category.id)}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-md cursor-pointer",
                    expandedCategories.includes(category.id)
                      ? "bg-secondary/80 text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <category.icon className="h-5 w-5" />
                    <span className="text-sm font-medium">
                      {category.label}
                    </span>
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      expandedCategories.includes(category.id) &&
                        "transform rotate-180"
                    )}
                  />
                </div>
              )}

              {/* Category Items - only show when expanded and not collapsed */}
              {expandedCategories.includes(category.id) && !isCollapsed && (
                <ul className="mt-1 space-y-1 pl-2">
                  {category.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        to={item.path}
                        className={cn(
                          "flex items-center rounded-md py-2 px-3 text-sm transition-colors",
                          location.pathname === item.path
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                        )}
                      >
                        <item.icon className="h-5 w-5 mr-2" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}

          {/* Divider before settings */}
          <li className="my-2">
            <div className="h-px bg-border mx-1"></div>
          </li>

          {/* Settings at the bottom */}
          {renderNavItem(GamesNavItem)}
          {renderNavItem(RewardsNavItem)}
          {renderNavItem(settingsNavItem)}
        </ul>
      </nav>

      <div className="p-4 border-t">
        {isCollapsed ? (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-9 h-9 rounded-full overflow-hidden p-0 mx-auto"
              >
                <img
                  src={
                    currentUser?.avatar ||
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=User"
                  }
                  alt="User avatar"
                  className="w-full h-full object-cover"
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              side="right"
              align="end"
              className="p-0 w-48 border border-border/60 bg-popover/95 backdrop-blur-sm"
              sideOffset={5}
            >
              <div className="p-3 border-b border-border/50 bg-background/50">
                <p className="font-medium">{currentUser?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {currentUser?.studentId}
                </p>
              </div>
              <div className="p-1">
                <Link
                  to="/settings"
                  className="flex items-center py-1.5 px-2 text-sm rounded-md hover:bg-secondary w-full text-left"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center py-1.5 px-2 text-sm rounded-md hover:bg-secondary w-full text-left text-red-500"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                <img
                  src={
                    currentUser?.avatar ||
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=User"
                  }
                  alt="User avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">
                  {currentUser?.name || "User"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {currentUser?.studentId || ""}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-red-500"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default DashboardSidebar;

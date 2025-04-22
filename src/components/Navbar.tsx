import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogIn, User, Moon, Sun, Palette } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const { isLoggedIn, logout, theme, setTheme } = useApp();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const [mounted, setMounted] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // Set mounted state for animations
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-500",
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          to="/"
          className={cn(
            "flex items-center gap-2 group transition-transform duration-1000 ease-out",
            mounted ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
          )}
        >
          <div className="relative w-9 h-9 rounded-full bg-gradient-to-r from-primary to-primary/60 flex items-center justify-center overflow-hidden">
            <span className="text-white font-bold text-lg">A</span>
            <div className="absolute inset-0 rounded-full border border-primary/30 group-hover:animate-pulse-slow"></div>
          </div>
          <span className="font-bold text-xl gradient-text tracking-tight">
            ARC
          </span>
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <nav className="hidden md:flex items-center space-x-8">
            {[
              { path: "/", label: "Home", delay: 200 },
              ...(isLoggedIn
                ? [
                    { path: "/dashboard", label: "Dashboard", delay: 300 },
                    { path: "/courses", label: "Courses", delay: 400 },
                    { path: "/wellness", label: "Wellness", delay: 500 },
                  ]
                : [{ path: "/about", label: "About", delay: 300 }]),
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-foreground/70 hover:text-primary transition-all duration-300 relative py-1 px-2",
                  location.pathname === item.path && "text-primary font-medium",
                  mounted
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-4 opacity-0"
                )}
                style={{ transitionDelay: `${item.delay}ms` }}
              >
                {item.label}
                {location.pathname === item.path && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary/50 rounded-full animate-pulse-slow"></span>
                )}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "relative w-9 h-9 rounded-full bg-background/40 backdrop-blur-sm transition-all duration-700",
                  mounted
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                )}
                style={{ transitionDelay: "600ms" }}
              >
                <Palette className="h-4 w-4" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="backdrop-blur-md bg-background/80 border border-border/50"
            >
              <DropdownMenuItem
                onClick={() => setTheme("light")}
                className={cn(theme === "light" && "bg-secondary")}
              >
                <Sun className="h-4 w-4 mr-2" />
                <span>Light</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("dark")}
                className={cn(theme === "dark" && "bg-secondary")}
              >
                <Moon className="h-4 w-4 mr-2" />
                <span>Dark</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("blue")}
                className={cn(theme === "blue" && "bg-secondary")}
              >
                <div className="h-4 w-4 mr-2 rounded-full bg-blue-500" />
                <span>Blue</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("pink")}
                className={cn(theme === "pink" && "bg-secondary")}
              >
                <div className="h-4 w-4 mr-2 rounded-full bg-pink-500" />
                <span>Pink</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <Link to="/settings">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "relative w-9 h-9 rounded-full bg-background/40 backdrop-blur-sm transition-all duration-700",
                    mounted
                      ? "translate-y-0 opacity-100"
                      : "translate-y-4 opacity-0"
                  )}
                  style={{ transitionDelay: "700ms" }}
                >
                  <User className="h-4 w-4" />
                  <span className="sr-only">Profile</span>
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className={cn(
                  "hidden md:flex rounded-full px-4 border-primary/20 bg-background/40 backdrop-blur-sm transition-all duration-700 hover:shadow-glow",
                  mounted
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                )}
                style={{ transitionDelay: "800ms" }}
              >
                Logout
              </Button>
            </div>
          ) : (
            <Link to="/login" className="hidden md:flex">
              <Button
                variant="default"
                size="sm"
                className={cn(
                  "gap-1 rounded-full px-5 bg-primary/90 hover:bg-primary backdrop-blur-sm transition-all duration-700 hover:shadow-glow",
                  mounted
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                )}
                style={{ transitionDelay: "700ms" }}
              >
                <LogIn className="h-4 w-4" />
                Login
              </Button>
            </Link>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "md:hidden w-9 h-9 rounded-full bg-background/40 backdrop-blur-sm transition-all duration-700",
              mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            )}
            style={{ transitionDelay: "600ms" }}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobile && isMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-b shadow-md absolute w-full">
          <nav className="container mx-auto px-4 py-6 flex flex-col space-y-5">
            {[
              { path: "/", label: "Home", delay: 100 },
              ...(isLoggedIn
                ? [
                    { path: "/dashboard", label: "Dashboard", delay: 150 },
                    { path: "/courses", label: "Courses", delay: 200 },
                    { path: "/wellness", label: "Wellness", delay: 250 },
                  ]
                : [{ path: "/about", label: "About", delay: 150 }]),
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-foreground/80 hover:text-primary transition-all duration-300 py-2",
                  location.pathname === item.path && "text-primary font-medium"
                )}
                onClick={closeMenu}
                style={{
                  animationName: "slideInRight",
                  animationDuration: "0.3s",
                  animationFillMode: "both",
                  animationDelay: `${item.delay}ms`,
                }}
              >
                {item.label}
              </Link>
            ))}

            {isLoggedIn ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  logout();
                  closeMenu();
                }}
                className="w-full rounded-full border-primary/20 bg-background/40 backdrop-blur-sm"
                style={{
                  animationName: "slideInRight",
                  animationDuration: "0.3s",
                  animationFillMode: "both",
                  animationDelay: "300ms",
                }}
              >
                Logout
              </Button>
            ) : (
              <Link to="/login" onClick={closeMenu}>
                <Button
                  variant="default"
                  size="sm"
                  className="w-full gap-1 rounded-full bg-primary/90 hover:bg-primary backdrop-blur-sm"
                  style={{
                    animationName: "slideInRight",
                    animationDuration: "0.3s",
                    animationFillMode: "both",
                    animationDelay: "200ms",
                  }}
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;

import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import DashboardSidebar from "./DashboardSidebar";
import { useApp } from "@/contexts/AppContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { isLoggedIn } = useApp();
  const isMobile = useIsMobile();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Track sidebar state based on window width
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarCollapsed(window.innerWidth <= 1180);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Redirect to login if not logged in
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar />
      <main
        className={cn(
          "flex-1 overflow-y-auto bg-background",
          isMobile ? "p-3 md:p-4" : "p-4 md:p-6",
          isSidebarCollapsed && !isMobile && "md:pl-6"
        )}
      >
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;

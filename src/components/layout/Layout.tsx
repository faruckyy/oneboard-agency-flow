
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background/95 to-background/90">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} isSidebarOpen={sidebarOpen} />
      <div className="flex flex-1 relative">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <main className={cn(
          "flex-1 p-4 transition-all duration-500 pt-20",
          sidebarOpen ? "md:pl-64" : "md:pl-20"
        )}>
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Theme and admin buttons at the bottom of the screen (fixed position) */}
      <div className="fixed bottom-6 left-6 z-20">
        <div className={cn(
          "transition-all duration-500 rounded-full p-2 bg-sidebar backdrop-blur-lg shadow-lg",
          sidebarOpen ? "md:translate-x-64" : ""
        )}>
          <ThemeToggle />
        </div>
      </div>
      
      <div className="fixed bottom-6 right-6 z-20">
        <Button 
          variant="outline"
          onClick={() => window.location.href = '/admin'}
          className="rounded-full bg-sidebar backdrop-blur-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Admin
        </Button>
      </div>
    </div>
  );
};

export default Layout;

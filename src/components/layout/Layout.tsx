
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { appleEasing, appleDuration } from "@/utils/animation";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ 
        duration: appleDuration.standard, 
        ease: appleEasing.entrance 
      }}
      className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-background/98"
    >
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} isSidebarOpen={sidebarOpen} />
      
      <div className="flex flex-1 relative">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        
        <motion.main 
          className={cn(
            "flex-1 pt-20",
            sidebarOpen ? "md:pl-64" : "md:pl-20",
            "px-4 py-4 md:px-6 lg:px-8"
          )}
          animate={{
            paddingLeft: sidebarOpen ? (isMobile ? "1rem" : "16rem") : (isMobile ? "1rem" : "5rem")
          }}
          transition={{
            duration: appleDuration.standard,
            ease: appleEasing.standard
          }}
        >
          <div className="container mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={window.location.pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ 
                  duration: appleDuration.standard, 
                  ease: appleEasing.standard 
                }}
                className="w-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.main>
      </div>
      
      <div className="fixed bottom-6 right-6 z-20">
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ 
            duration: appleDuration.short,
            ease: appleEasing.button
          }}
        >
          <Button 
            variant="outline"
            onClick={() => window.location.href = '/admin'}
            className="rounded-full shadow-sm hover:shadow-md transition-all duration-200
                      bg-card/90 border-border/50 dark:bg-card/90 dark:border-border/50"
          >
            <Settings className="h-5 w-5 mr-2 text-primary" />
            <span className="font-medium">Admin</span>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Layout;


import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

// Apple-style easing curves
const appleEasing = {
  standard: [0.2, 0.65, 0.3, 0.9],
  entrance: [0, 0.5, 0.25, 1],
  exit: [0.25, 0, 1, 0.5],
  button: [0.25, 0.1, 0.25, 1]
};

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
      transition={{ duration: 0.5, ease: appleEasing.entrance }}
      className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background/95 to-background/90"
    >
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} isSidebarOpen={sidebarOpen} />
      
      <div className="flex flex-1 relative">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        
        <motion.main 
          className={cn(
            "flex-1 transition-all duration-300 pt-20",
            sidebarOpen ? "md:pl-64" : "md:pl-20",
            "px-4 py-4 md:px-6 lg:px-8"
          )}
          animate={{
            paddingLeft: sidebarOpen ? (isMobile ? "1rem" : "16rem") : (isMobile ? "1rem" : "5rem")
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
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
                  duration: 0.4, 
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
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ 
            duration: 0.2,
            ease: appleEasing.button
          }}
        >
          <Button 
            variant="outline"
            onClick={() => window.location.href = '/admin'}
            className="rounded-full backdrop-blur-lg shadow-lg hover:shadow-xl transition-all duration-300
                      border border-[rgba(255,255,255,0.2)] bg-background/80 dark:bg-sidebar/80"
          >
            <Settings className="h-5 w-5 mr-2 text-primary" />
            Admin
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Layout;

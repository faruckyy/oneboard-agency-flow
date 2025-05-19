
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

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
      className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background/95 to-background/90"
    >
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} isSidebarOpen={sidebarOpen} />
      <div className="flex flex-1 relative">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <motion.main 
          className={cn(
            "flex-1 p-4 transition-all duration-500 pt-20",
            sidebarOpen ? "md:pl-64" : "md:pl-20"
          )}
          animate={{
            paddingLeft: sidebarOpen ? (isMobile ? "1rem" : "16rem") : (isMobile ? "1rem" : "5rem")
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
        >
          <div className="container mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={window.location.pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
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
        >
          <Button 
            variant="outline"
            onClick={() => window.location.href = '/admin'}
            className="rounded-full bg-sidebar backdrop-blur-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Settings className="h-5 w-5 mr-2" />
            Admin
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Layout;


import { useNavigate, useLocation } from "react-router-dom";
import { 
  Home, 
  ClipboardList, 
  Brush, 
  LineChart, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Grid 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar = ({ open, setOpen }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const links = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Limpeza", icon: ClipboardList, path: "/cleaning" },
    { name: "Tarefas de Design", icon: Brush, path: "/design" },
    { name: "Tarefas Comerciais", icon: LineChart, path: "/commercial" },
    { name: "Admin", icon: Settings, path: "/admin" },
  ];

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-10 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar - MacOS inspired */}
      <motion.div 
        className={cn(
          "fixed z-20 inset-y-0 left-0 bg-sidebar flex flex-col transition-all duration-500 ease-in-out",
          open ? "w-64" : "w-20"
        )}
        animate={{ width: open ? 256 : 80 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex flex-col h-full rounded-r-3xl overflow-hidden backdrop-blur-md bg-sidebar/95 shadow-2xl">
          {/* Space for header */}
          <div className="h-16 flex-shrink-0"></div>
          
          {/* User profile */}
          <div className="flex items-center px-5 py-6">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-lg font-medium text-sidebar-foreground">O</span>
            </div>
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="ml-3 overflow-hidden"
                >
                  <p className="text-xs text-sidebar-foreground/70 uppercase tracking-wider font-medium">Sistema</p>
                  <p className="text-sidebar-foreground font-semibold">OneBoard</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Main Navigation - MacOS style */}
          <div className="mt-6 px-4">
            <div className="text-xs text-sidebar-foreground/50 uppercase tracking-wider font-bold mb-3 px-2">
              {open ? "Menu Principal" : ""}
            </div>
            <div className="space-y-2">
              {links.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <motion.div
                    key={link.path}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "flex items-center py-2 px-3 cursor-pointer transition-all duration-200 rounded-xl",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-foreground font-medium"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                    )}
                    onClick={() => {
                      navigate(link.path);
                      if (window.innerWidth < 768) {
                        setOpen(false);
                      }
                    }}
                  >
                    <link.icon className={cn(
                      "flex-shrink-0 transition-all",
                      open ? "h-5 w-5" : "h-6 w-6"
                    )} />
                    <AnimatePresence>
                      {open && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="ml-3 text-sm"
                        >
                          {link.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
          
          {/* Collapsible button */}
          <div className="mt-auto border-t border-sidebar-border p-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setOpen(!open)}
              className="w-full rounded-xl py-2 flex items-center justify-center hover:bg-sidebar-accent/50 transition-all"
            >
              {open ? (
                <ChevronLeft className="h-5 w-5 text-sidebar-foreground" />
              ) : (
                <ChevronRight className="h-5 w-5 text-sidebar-foreground" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;

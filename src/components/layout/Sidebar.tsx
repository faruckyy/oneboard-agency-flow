
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Home, 
  ClipboardList, 
  Brush, 
  LineChart, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { appleEasing, appleDuration } from "@/utils/animation";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

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
    <TooltipProvider delayDuration={0}>
      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: appleDuration.standard,
              ease: appleEasing.standard
            }}
            className="fixed inset-0 z-10 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar - Design moderno com menor transparência */}
      <motion.div 
        className="fixed z-20 inset-y-0 left-0 flex flex-col"
        animate={{ width: open ? 256 : 80 }}
        transition={{ 
          duration: appleDuration.standard,
          ease: appleEasing.standard
        }}
      >
        <div className="flex flex-col h-full overflow-hidden bg-sidebar-background shadow-lg border-r border-sidebar-border">
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
                  transition={{ duration: appleDuration.standard, ease: appleEasing.standard }}
                  className="ml-3 overflow-hidden"
                >
                  <p className="text-xs text-sidebar-foreground/70 uppercase tracking-wider font-medium">Sistema</p>
                  <p className="text-sidebar-foreground font-semibold">OneBoard</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Main Navigation */}
          <div className="mt-6 px-3">
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: appleDuration.standard, ease: appleEasing.standard }}
                  className="text-xs text-sidebar-foreground/70 uppercase tracking-wider font-bold mb-3 px-2"
                >
                  Menu Principal
                </motion.div>
              )}
            </AnimatePresence>
            <div className="space-y-1">
              {links.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Tooltip key={link.path}>
                    <TooltipTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: appleDuration.short, ease: appleEasing.button }}
                        className={cn(
                          "flex items-center py-2 px-3 cursor-pointer transition-all duration-200 rounded-xl relative",
                          isActive
                            ? "bg-sidebar-accent text-primary font-medium"
                            : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
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
                              initial={{ opacity: 0, x: -10, width: 0 }}
                              animate={{ opacity: 1, x: 0, width: 'auto' }}
                              exit={{ opacity: 0, x: -10, width: 0 }}
                              transition={{ duration: appleDuration.standard, ease: appleEasing.standard }}
                              className="ml-3 text-sm"
                            >
                              {link.name}
                            </motion.span>
                          )}
                        </AnimatePresence>
                        {isActive && (
                          <motion.div 
                            layoutId="active-indicator"
                            className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-md"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: appleDuration.short }}
                          />
                        )}
                      </motion.div>
                    </TooltipTrigger>
                    {!open && (
                      <TooltipContent side="right" className="bg-background/90 backdrop-blur-sm">
                        {link.name}
                      </TooltipContent>
                    )}
                  </Tooltip>
                );
              })}
            </div>
          </div>
          
          {/* Collapsible button */}
          <div className="mt-auto border-t border-sidebar-border p-3">
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: appleDuration.short, ease: appleEasing.button }}
              onClick={() => setOpen(!open)}
              className="w-full rounded-xl py-2 flex items-center justify-center hover:bg-sidebar-accent/50 transition-all"
              aria-label={open ? "Recolher menu" : "Expandir menu"}
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
    </TooltipProvider>
  );
};

export default Sidebar;

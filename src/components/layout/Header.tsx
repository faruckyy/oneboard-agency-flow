
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { appleEasing, appleDuration } from "@/utils/animation";

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header = ({ toggleSidebar, isSidebarOpen }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <TooltipProvider>
      <header className="fixed top-0 left-0 right-0 z-20 w-full backdrop-blur-lg bg-background/40 dark:bg-sidebar-background/40 border-b border-border/40">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 md:gap-6">
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ 
                    duration: appleDuration.short,
                    ease: appleEasing.button
                  }}
                  className="p-2 rounded-full hover:bg-background/60 dark:hover:bg-sidebar-accent/30 transition-colors"
                  onClick={toggleSidebar}
                >
                  {isSidebarOpen ? (
                    <X className="h-5 w-5 text-foreground transition-transform duration-300" />
                  ) : (
                    <Menu className="h-5 w-5 text-foreground transition-transform duration-300" />
                  )}
                </motion.button>
              </TooltipTrigger>
              <TooltipContent>
                {isSidebarOpen ? "Fechar menu" : "Abrir menu"}
              </TooltipContent>
            </Tooltip>
            
            <motion.div
              onClick={() => navigate("/")}
              className="text-2xl font-bold cursor-pointer transition-all hover:text-primary flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ 
                duration: appleDuration.short,
                ease: appleEasing.button
              }}
            >
              {/* Logo moderno */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-bold shadow-md">
                O
              </div>
              <span className="hidden sm:block font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent tracking-tight">
                OneBoard
              </span>
            </motion.div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium text-muted-foreground hidden md:block">
              {new Date().toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            
            <ThemeToggle />
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
};

export default Header;

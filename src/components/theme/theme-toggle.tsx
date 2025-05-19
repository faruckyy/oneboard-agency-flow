
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme/theme-provider";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full transition-all duration-500 bg-sidebar-accent hover:bg-sidebar-accent/70"
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: theme === "dark" ? 180 : 0 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-yellow-300 transition-all" />
              ) : (
                <Moon className="h-5 w-5 text-blue-500 transition-all" />
              )}
            </motion.div>
            <span className="sr-only">Toggle theme</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {theme === "dark" ? "Mudar para modo claro" : "Mudar para modo escuro"}
        </TooltipContent>
      </Tooltip>
    </motion.div>
  );
}

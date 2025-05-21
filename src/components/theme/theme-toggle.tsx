
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme/theme-provider";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { appleEasing, appleDuration } from "@/utils/animation";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ 
            duration: appleDuration.short,
            ease: appleEasing.button
          }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full transition-all duration-300 bg-card/30 backdrop-blur-md border border-border/50 shadow-sm hover:shadow-md"
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: theme === "dark" ? 180 : 0 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
            >
              {theme === "dark" ? (
                <Moon className="h-5 w-5 text-yellow-400 transition-all" />
              ) : (
                <Sun className="h-5 w-5 text-amber-500 transition-all" />
              )}
            </motion.div>
            <span className="sr-only">Alternar tema</span>
          </Button>
        </motion.div>
      </TooltipTrigger>
      <TooltipContent>
        {theme === "dark" ? "Mudar para modo claro" : "Mudar para modo escuro"}
      </TooltipContent>
    </Tooltip>
  );
}

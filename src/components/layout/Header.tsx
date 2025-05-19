
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-20 w-full border-b bg-background/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2 md:gap-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1
            onClick={() => navigate("/")}
            className="text-2xl font-bold cursor-pointer transition-all hover:text-primary flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              O
            </div>
            <span className="hidden sm:inline">OneBoard</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button
            onClick={() => navigate("/admin")}
            className={cn(
              "px-4 py-2 text-sm font-medium neumorph-light hover:neumorph-pressed",
              "transition-all duration-200"
            )}
          >
            Admin
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;

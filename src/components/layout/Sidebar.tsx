
import { useNavigate, useLocation } from "react-router-dom";
import { Home, ClipboardList, Brush, LineChart, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
      {open && (
        <div 
          className="fixed inset-0 z-10 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed z-20 inset-y-0 left-0 w-64 bg-sidebar flex flex-col transition-all duration-300 ease-in-out transform md:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              O
            </div>
            <span className="font-semibold text-sidebar-foreground">OneBoard</span>
          </div>
          <button 
            onClick={() => setOpen(false)}
            className="p-1 rounded-full hover:bg-sidebar-accent md:hidden"
          >
            <ChevronLeft className="h-5 w-5 text-sidebar-foreground" />
          </button>
        </div>
        
        <div className="flex flex-col flex-1 py-4">
          <nav className="flex-1 px-3 space-y-1">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <div
                  key={link.path}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md cursor-pointer transition-all duration-200",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                  onClick={() => {
                    navigate(link.path);
                    setOpen(false);
                  }}
                >
                  <link.icon className="h-5 w-5 mr-3" />
                  <span className="text-sm">{link.name}</span>
                </div>
              );
            })}
          </nav>
        </div>
        
        {/* Collapse button for desktop */}
        <div className="hidden md:block border-t border-sidebar-border p-4">
          <button 
            onClick={() => setOpen(!open)}
            className="p-2 w-full rounded-md flex items-center justify-center hover:bg-sidebar-accent transition-colors"
          >
            <ChevronLeft className={cn(
              "h-5 w-5 text-sidebar-foreground transition-transform",
              open ? "" : "rotate-180"
            )} />
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

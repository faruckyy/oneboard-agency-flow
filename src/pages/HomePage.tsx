
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Brush, LineChart, ClipboardList, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

// Available module icon options
const iconOptions = {
  ClipboardList,
  Brush,
  LineChart,
  Settings
};

// Available gradient options
const gradientOptions = [
  { name: "Azul-Roxo", value: "from-blue-400 to-indigo-500" },
  { name: "Verde-Azul", value: "from-green-400 to-blue-500" },
  { name: "Amarelo-Laranja", value: "from-amber-400 to-orange-500" },
  { name: "Rosa-Roxo", value: "from-pink-400 to-purple-500" },
  { name: "Vermelho-Rosa", value: "from-red-400 to-pink-500" },
  { name: "Roxo-Azul", value: "from-purple-400 to-blue-500" },
  { name: "Ciano-Azul", value: "from-cyan-400 to-blue-500" }
];

// Default sections
const defaultSections = [
  {
    title: "Limpeza",
    description: "Gerenciamento de escalas e tarefas de limpeza",
    path: "/cleaning",
    icon: "ClipboardList",
    gradient: "from-green-400 to-emerald-500"
  },
  {
    title: "Tarefas Designers",
    description: "Gerenciamento de projetos da equipe de design",
    path: "/design",
    icon: "Brush",
    gradient: "from-blue-400 to-indigo-500"
  },
  {
    title: "Tarefas Comercial e Social Media",
    description: "Controle de tarefas para equipe comercial e social media",
    path: "/commercial",
    icon: "LineChart",
    gradient: "from-amber-400 to-orange-500"
  }
];

// Module customization component
const ModuleCustomizer = ({ section, onSave }) => {
  const [icon, setIcon] = useState(section.icon);
  const [gradient, setGradient] = useState(section.gradient);

  const handleSave = () => {
    onSave({
      ...section,
      icon,
      gradient
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Ícone</label>
        <Select value={icon} onValueChange={setIcon}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione um ícone" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(iconOptions).map((iconName) => (
              <SelectItem key={iconName} value={iconName}>
                <div className="flex items-center gap-2">
                  {React.createElement(iconOptions[iconName], { className: "h-4 w-4" })}
                  <span>{iconName}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Cor/Gradiente</label>
        <Select value={gradient} onValueChange={setGradient}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione um gradiente" />
          </SelectTrigger>
          <SelectContent>
            {gradientOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${option.value}`} />
                  <span>{option.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Button onClick={handleSave} className="w-full">Salvar Alterações</Button>
    </div>
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  const [sections, setSections] = useState(() => {
    // Try to get from localStorage or use default
    const saved = localStorage.getItem('oneboardModules');
    return saved ? JSON.parse(saved) : defaultSections;
  });
  
  const [editingSection, setEditingSection] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleEditSection = (section) => {
    setEditingSection(section);
    setDialogOpen(true);
  };
  
  const handleSaveSection = (updatedSection) => {
    const newSections = sections.map(section => 
      section.path === updatedSection.path ? updatedSection : section
    );
    
    setSections(newSections);
    localStorage.setItem('oneboardModules', JSON.stringify(newSections));
    setDialogOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-in">
        <div className="mx-auto w-24 h-24 mb-6">
          <img 
            src="https://lovable-uploads/ef58d7e5-8c26-4ed4-b9c2-c5b8c05c0f78.png" 
            alt="71 Project" 
            className="w-full h-full object-contain dark:hidden" 
          />
          <img 
            src="https://lovable-uploads/7c937186-ae9c-4130-ba00-783382a99d82.png" 
            alt="71 Project" 
            className="w-full h-full object-contain hidden dark:block" 
          />
        </div>
        
        <h1 className="mb-4 text-4xl font-bold sm:text-5xl">
          <span className="bg-gradient-to-r from-yellow-400 to-amber-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            OneBoard
          </span>
        </h1>
        <p className="text-lg text-muted-foreground">
          Gerencie todos os aspectos da sua agência em um só lugar
        </p>
      </div>
      
      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((section, index) => {
          const IconComponent = iconOptions[section.icon];
          
          return (
            <div
              key={section.path}
              className={cn(
                "group cursor-pointer p-6 transition-all duration-300 animate-fade-in relative",
                "hover:scale-[1.02] active:scale-[0.98] rounded-xl overflow-hidden",
                "bg-card/60 dark:bg-sidebar/60 backdrop-blur-md border border-border/50",
                "shadow-md hover:shadow-lg"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => navigate(section.path)}
            >
              <div className="absolute top-0 right-0 w-20 h-20 -mr-6 -mt-6 rounded-full opacity-10" 
                   style={{background: `linear-gradient(225deg, var(--primary), transparent)`}} />
              
              <div className="flex items-center justify-between">
                <div className={`mb-4 h-12 w-12 p-2 rounded-lg bg-gradient-to-r ${section.gradient} text-white`}>
                  <IconComponent className="h-full w-full" />
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditSection(section);
                  }}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
              
              <h2 className="mb-2 text-xl font-semibold group-hover:text-primary transition-colors">
                {section.title}
              </h2>
              <p className="text-muted-foreground">{section.description}</p>
              
              <Button 
                variant="ghost" 
                className="mt-4 px-0 text-primary hover:bg-transparent hover:text-primary/70"
              >
                Acessar
              </Button>
            </div>
          );
        })}
      </div>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Personalizar Módulo</DialogTitle>
          </DialogHeader>
          {editingSection && (
            <ModuleCustomizer 
              section={editingSection} 
              onSave={handleSaveSection}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomePage;

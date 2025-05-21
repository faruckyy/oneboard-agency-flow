
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Brush, LineChart, ClipboardList, Settings, Users, FileText, Calendar, Mail } from "lucide-react";
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
import { motion } from "framer-motion";

// Available module icon options
const iconOptions = {
  ClipboardList,
  Brush,
  LineChart,
  Settings,
  Users,
  FileText,
  Calendar,
  Mail
};

// Available gradient options - Updated with better contrasting colors
const gradientOptions = [
  { name: "Azul-Índigo", value: "from-blue-500 to-indigo-600" },
  { name: "Verde-Azul", value: "from-emerald-500 to-blue-600" },
  { name: "Roxo-Rosa", value: "from-purple-500 to-pink-500" },
  { name: "Ciano-Azul", value: "from-cyan-500 to-blue-600" },
  { name: "Azul-Violeta", value: "from-blue-500 to-violet-600" },
  { name: "Índigo-Roxo", value: "from-indigo-500 to-purple-600" },
  { name: "Verde-Esmeralda", value: "from-teal-500 to-emerald-600" }
];

// Default sections with updated colors
const defaultSections = [
  {
    title: "Limpeza",
    description: "Gerenciamento de escalas e tarefas de limpeza",
    path: "/cleaning",
    icon: "ClipboardList",
    gradient: "from-blue-500 to-indigo-600"
  },
  {
    title: "Tarefas Designers",
    description: "Gerenciamento de projetos da equipe de design",
    path: "/design",
    icon: "Brush",
    gradient: "from-indigo-500 to-purple-600"
  },
  {
    title: "Tarefas Comercial e Social Media",
    description: "Controle de tarefas para equipe comercial e social media",
    path: "/commercial",
    icon: "LineChart",
    gradient: "from-teal-500 to-emerald-600"
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
          <SelectTrigger className="w-full bg-background/90">
            <SelectValue placeholder="Selecione um ícone" />
          </SelectTrigger>
          <SelectContent className="bg-background/95 backdrop-blur-md">
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
          <SelectTrigger className="w-full bg-background/90">
            <SelectValue placeholder="Selecione um gradiente" />
          </SelectTrigger>
          <SelectContent className="bg-background/95 backdrop-blur-md">
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

const ModuleCard = ({ section, onEdit, index }) => {
  const navigate = useNavigate();
  const IconComponent = iconOptions[section.icon];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={cn(
        "group cursor-pointer p-6 transition-all duration-300 relative",
        "hover:scale-[1.02] active:scale-[0.98] rounded-xl overflow-hidden",
        "bg-card shadow-md hover:shadow-lg border border-border/80"
      )}
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
            onEdit(section);
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
    </motion.div>
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
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-24 h-24 mb-6"
        >
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
        </motion.div>
        
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-4 text-4xl font-bold sm:text-5xl"
        >
          <span className="bg-gradient-to-r from-primary to-primary/80 dark:from-primary dark:to-primary/80 bg-clip-text text-transparent">
            OneBoard
          </span>
        </motion.h1>
        <motion.p 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-lg text-muted-foreground"
        >
          Gerencie todos os aspectos da sua agência em um só lugar
        </motion.p>
      </div>
      
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((section, index) => (
          <ModuleCard 
            key={section.path} 
            section={section} 
            index={index} 
            onEdit={handleEditSection} 
          />
        ))}
      </div>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card/90 backdrop-blur-md border border-border/80 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-medium">Personalizar Módulo</DialogTitle>
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

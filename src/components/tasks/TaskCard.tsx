
import { useState } from "react";
import { ChevronDown, ChevronUp, FileText, Feather, Clock, AlertTriangle, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TaskBriefing, { BriefingData } from "./TaskBriefing";
import { motion, AnimatePresence } from "framer-motion";

export type TaskStatus = 
  | "Na fila" 
  | "Aguardando Informações" 
  | "Fazendo" 
  | "Pausado" 
  | "Aguardando Material" 
  | "Aguardando Aprovação"
  | "Concluído";

export type TaskPriority = "Urgente" | "Normal" | "Leve";

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  status: TaskStatus;
  priority: TaskPriority;
  briefings?: BriefingData[];
  coverImage?: string;
}

interface TaskCardProps {
  task: Task;
  onUpdate: (task: Task) => void;
}

const TaskCard = ({ task, onUpdate }: TaskCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [briefingOpen, setBriefingOpen] = useState(false);
  const [currentBriefing, setCurrentBriefing] = useState<BriefingData | undefined>(undefined);
  const [showImageInput, setShowImageInput] = useState(false);
  const [imageUrl, setImageUrl] = useState(task.coverImage || "");

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case "Urgente":
        return "priority-urgent";
      case "Normal":
        return "priority-normal";
      case "Leve":
        return "priority-low";
      default:
        return "priority-normal";
    }
  };
  
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "Na fila":
        return "border-gray-400 bg-gray-400/10";
      case "Aguardando Informações":
        return "border-blue-400 bg-blue-400/10";
      case "Fazendo":
        return "border-green-500 bg-green-500/10";
      case "Pausado":
        return "border-amber-400 bg-amber-400/10";
      case "Aguardando Material":
        return "border-purple-400 bg-purple-400/10";
      case "Aguardando Aprovação":
        return "border-indigo-400 bg-indigo-400/10";
      case "Concluído":
        return "border-emerald-500 bg-emerald-500/10";
      default:
        return "border-gray-400 bg-gray-400/10";
    }
  };
  
  const getStatusIndicator = (status: TaskStatus) => {
    switch (status) {
      case "Na fila":
        return "left-0 w-1 h-full bg-gray-400";
      case "Aguardando Informações":
        return "left-0 w-1 h-full bg-blue-400 animate-pulse";
      case "Fazendo":
        return "left-0 w-2 h-full bg-green-500 animate-pulse";
      case "Pausado":
        return "left-0 w-1 h-full bg-amber-400";
      case "Aguardando Material":
        return "left-0 w-1 h-full bg-purple-400 animate-pulse";
      case "Aguardando Aprovação":
        return "left-0 w-1 h-full bg-indigo-400 animate-pulse";
      case "Concluído":
        return "left-0 w-2 h-full bg-emerald-500";
      default:
        return "left-0 w-1 h-full bg-gray-400";
    }
  };
  
  const getPriorityIcon = (priority: TaskPriority) => {
    switch (priority) {
      case "Urgente":
        return <AlertTriangle className="h-4 w-4 text-priority-urgent" />;
      case "Normal":
        return <Clock className="h-4 w-4 text-priority-normal" />;
      case "Leve":
        return <Feather className="h-4 w-4 text-priority-low" />;
      default:
        return <Clock className="h-4 w-4 text-priority-normal" />;
    }
  };

  const handleStatusChange = (value: string) => {
    onUpdate({
      ...task,
      status: value as TaskStatus,
    });
  };

  const handlePriorityChange = (value: string) => {
    onUpdate({
      ...task,
      priority: value as TaskPriority,
    });
  };

  const handleSaveBriefing = (data: BriefingData) => {
    const newBriefings = [...(task.briefings || [])];
    
    if (currentBriefing) {
      // Edit existing briefing
      const index = newBriefings.findIndex(b => b.title === currentBriefing.title);
      if (index !== -1) {
        newBriefings[index] = data;
      } else {
        newBriefings.push(data);
      }
    } else {
      // Add new briefing
      newBriefings.push(data);
    }
    
    onUpdate({
      ...task,
      briefings: newBriefings,
    });
    
    setCurrentBriefing(undefined);
  };

  const handleAddCoverImage = () => {
    if (imageUrl) {
      onUpdate({
        ...task,
        coverImage: imageUrl,
      });
      setShowImageInput(false);
    }
  };

  const handleOpenNewBriefing = () => {
    setCurrentBriefing(undefined);
    setBriefingOpen(true);
  };

  const handleOpenExistingBriefing = (briefing: BriefingData) => {
    setCurrentBriefing(briefing);
    setBriefingOpen(true);
  };

  return (
    <motion.div 
      className={cn(
        "border rounded-xl overflow-hidden transition-all duration-300 backdrop-blur-md bg-background/40 dark:bg-sidebar/95 text-foreground shadow-md border-border relative card-hover",
        expanded ? "shadow-lg" : "shadow-md"
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        scale: 1.01, 
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" 
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      layout
    >
      {/* Status indicator - MacOS style */}
      <div className={cn("absolute", getStatusIndicator(task.status))} />
      
      {/* Cover image if available */}
      {task.coverImage && (
        <div className="w-full h-32 relative">
          <img 
            src={task.coverImage} 
            alt={`Capa para ${task.title}`} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 dark:from-sidebar/80 to-transparent" />
        </div>
      )}
      
      {/* Card header */}
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {getPriorityIcon(task.priority)}
              <h3 className="font-semibold text-lg">{task.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{task.description}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.05)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setExpanded(!expanded)}
            className="p-2 rounded-full hover:bg-background/80 dark:hover:bg-sidebar-accent transition-colors ml-2"
          >
            {expanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-border bg-background/60 dark:bg-sidebar-accent/30 backdrop-blur-md overflow-hidden"
          >
            <div className="p-5 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</label>
                  <Select defaultValue={task.status} onValueChange={handleStatusChange}>
                    <SelectTrigger className="bg-background/20 dark:bg-sidebar-accent/50 backdrop-blur-sm border-border text-foreground">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent className="bg-background/95 dark:bg-sidebar backdrop-blur-lg border-border">
                      <SelectItem value="Na fila">Na fila</SelectItem>
                      <SelectItem value="Aguardando Informações">Aguardando Informações</SelectItem>
                      <SelectItem value="Fazendo">Fazendo</SelectItem>
                      <SelectItem value="Pausado">Pausado</SelectItem>
                      <SelectItem value="Aguardando Material">Aguardando Material</SelectItem>
                      <SelectItem value="Aguardando Aprovação">Aguardando Aprovação</SelectItem>
                      <SelectItem value="Concluído">Concluído</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Prioridade</label>
                  <Select defaultValue={task.priority} onValueChange={handlePriorityChange}>
                    <SelectTrigger className="bg-background/20 dark:bg-sidebar-accent/50 backdrop-blur-sm border-border text-foreground">
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                    <SelectContent className="bg-background/95 dark:bg-sidebar backdrop-blur-lg border-border">
                      <SelectItem value="Urgente" className="text-priority-urgent">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          <span>Urgente</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Normal" className="text-priority-normal">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>Normal</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Leve" className="text-priority-low">
                        <div className="flex items-center gap-2">
                          <Feather className="h-4 w-4" />
                          <span>Leve</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Cover image section */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Imagem de Capa
                  </label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowImageInput(!showImageInput)}
                    className="text-xs"
                  >
                    {task.coverImage ? "Alterar" : "Adicionar"}
                  </Button>
                </div>
                
                <AnimatePresence>
                  {showImageInput && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-3 mb-4"
                    >
                      <input 
                        type="text" 
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="URL da imagem de capa"
                        className="w-full p-2 rounded-md bg-background/20 dark:bg-sidebar-accent/30 border border-border text-foreground"
                      />
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setShowImageInput(false)}
                        >
                          Cancelar
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={handleAddCoverImage}
                        >
                          Salvar
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {task.coverImage && !showImageInput && (
                  <div className="relative rounded-lg overflow-hidden h-24 mb-4 bg-background/20 dark:bg-sidebar-accent/30">
                    <img src={task.coverImage} alt="Capa do projeto" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/40 transition-opacity duration-200">
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        onClick={() => setShowImageInput(true)}
                      >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Alterar Imagem
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Briefings section */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Briefings
                  </label>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleOpenNewBriefing}
                    className="text-xs flex items-center gap-1"
                  >
                    <FileText className="h-3 w-3" />
                    Adicionar
                  </Button>
                </div>
                
                {/* List of existing briefings */}
                <div className="space-y-2 mt-2">
                  {(task.briefings || []).length > 0 ? (
                    task.briefings?.map((briefing, index) => (
                      <Button 
                        key={index}
                        onClick={() => handleOpenExistingBriefing(briefing)}
                        variant="outline"
                        className="w-full flex items-center gap-2 bg-background/40 dark:bg-sidebar-accent/40 backdrop-blur-sm border-border text-foreground hover:bg-background/60 dark:hover:bg-sidebar-accent rounded-xl h-auto py-3 justify-start group transition-all duration-300 shadow-sm hover:shadow-md"
                      >
                        <FileText className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-300" />
                        <div className="flex flex-col items-start text-left">
                          <span className="font-medium">{briefing.title}</span>
                          <span className="text-xs text-muted-foreground">{briefing.subtitle || "Ver detalhes"}</span>
                        </div>
                      </Button>
                    ))
                  ) : (
                    <div className="text-sm text-center p-3 border border-dashed border-border rounded-lg">
                      Nenhum briefing adicionado
                    </div>
                  )}
                </div>
                
                <div className="mt-3 text-center">
                  <Button 
                    onClick={handleOpenNewBriefing}
                    variant="ghost"
                    className="w-full flex items-center justify-center gap-2 text-primary"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Adicionar Novo Briefing</span>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Briefing modal */}
      <TaskBriefing 
        isOpen={briefingOpen} 
        onClose={() => setBriefingOpen(false)} 
        onSave={handleSaveBriefing}
        initialData={currentBriefing}
      />
    </motion.div>
  );
};

export default TaskCard;

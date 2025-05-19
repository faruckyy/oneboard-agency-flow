
import { useState } from "react";
import { ChevronDown, ChevronUp, FileText, Feather, Clock, AlertTriangle } from "lucide-react";
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
  briefing?: BriefingData;
}

interface TaskCardProps {
  task: Task;
  onUpdate: (task: Task) => void;
}

const TaskCard = ({ task, onUpdate }: TaskCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [briefingOpen, setBriefingOpen] = useState(false);

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
    onUpdate({
      ...task,
      briefing: data,
    });
  };

  return (
    <motion.div 
      className={cn(
        "border rounded-xl overflow-hidden transition-all duration-300 backdrop-blur-md bg-background/40 dark:bg-sidebar text-foreground shadow-md border-border relative card-hover",
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
              
              <div className="mt-6">
                {task.briefing ? (
                  <Button 
                    onClick={() => setBriefingOpen(true)}
                    variant="outline"
                    className="w-full flex items-center gap-2 bg-background/40 dark:bg-sidebar-accent/40 backdrop-blur-sm border-border text-foreground hover:bg-background/60 dark:hover:bg-sidebar-accent rounded-xl h-auto py-4 group transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <FileText className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-300" />
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{task.briefing.title}</span>
                      <span className="text-xs text-muted-foreground">{task.briefing.subtitle || "Ver detalhes do briefing"}</span>
                    </div>
                  </Button>
                ) : (
                  <Button 
                    onClick={() => setBriefingOpen(true)}
                    variant="outline"
                    className="w-full flex items-center gap-2 bg-background/40 dark:bg-sidebar-accent/40 backdrop-blur-sm border-border text-foreground hover:bg-background/60 dark:hover:bg-sidebar-accent rounded-xl h-auto py-4 transition-all duration-300"
                  >
                    <FileText className="h-5 w-5" />
                    <span>Adicionar Briefing</span>
                  </Button>
                )}
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
        initialData={task.briefing}
      />
    </motion.div>
  );
};

export default TaskCard;

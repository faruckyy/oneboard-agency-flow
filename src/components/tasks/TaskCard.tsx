
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
        return "border-green-400 bg-green-400/10";
      case "Pausado":
        return "border-amber-400 bg-amber-400/10";
      case "Aguardando Material":
        return "border-purple-400 bg-purple-400/10";
      case "Aguardando Aprovação":
        return "border-indigo-400 bg-indigo-400/10";
      case "Concluído":
        return "border-emerald-400 bg-emerald-400/10";
      default:
        return "border-gray-400 bg-gray-400/10";
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
        "border rounded-xl overflow-hidden transition-all duration-300 backdrop-blur-md bg-sidebar text-sidebar-foreground shadow-md border-sidebar-border",
        expanded ? "shadow-lg" : "shadow-md"
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Card header */}
      <div className="flex items-stretch">
        {/* Status indicator */}
        <div className={`w-2 h-full ${getStatusColor(task.status)}`} />
        
        <div className="flex-1 p-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {getPriorityIcon(task.priority)}
                <h3 className="font-semibold">{task.title}</h3>
              </div>
              <p className="text-sm text-sidebar-foreground/70">{task.description}</p>
            </div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1 rounded-full hover:bg-sidebar-accent transition-colors"
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </div>
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
            className="border-t border-sidebar-border bg-sidebar-accent/30 overflow-hidden"
          >
            <div className="p-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase tracking-wider text-sidebar-foreground/70">Status</label>
                  <Select defaultValue={task.status} onValueChange={handleStatusChange}>
                    <SelectTrigger className="bg-sidebar-accent/50 border-sidebar-border text-sidebar-foreground">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
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
                  <label className="text-xs font-medium uppercase tracking-wider text-sidebar-foreground/70">Prioridade</label>
                  <Select defaultValue={task.priority} onValueChange={handlePriorityChange}>
                    <SelectTrigger className="bg-sidebar-accent/50 border-sidebar-border text-sidebar-foreground">
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                    <SelectContent>
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
              
              <div className="mt-4">
                {task.briefing ? (
                  <Button 
                    onClick={() => setBriefingOpen(true)}
                    variant="outline"
                    className="w-full flex items-center gap-2 bg-sidebar-accent/50 border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Ver Briefing: {task.briefing.title}</span>
                  </Button>
                ) : (
                  <Button 
                    onClick={() => setBriefingOpen(true)}
                    variant="outline"
                    className="w-full flex items-center gap-2 bg-sidebar-accent/50 border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent"
                  >
                    <FileText className="h-4 w-4" />
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

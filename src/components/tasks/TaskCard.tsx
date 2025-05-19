
import { useState } from "react";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";
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
    <div className={cn(
      "border rounded-md overflow-hidden transition-all duration-300",
      expanded ? "shadow-lg" : "shadow-md"
    )}>
      {/* Card header */}
      <div className="flex items-stretch">
        {/* Priority indicator */}
        <div className={`${getPriorityColor(task.priority)} priority-badge`} />
        
        <div className="flex-1 p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{task.title}</h3>
              <p className="text-sm text-muted-foreground">{task.description}</p>
            </div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1 rounded hover:bg-muted transition-colors"
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
      {expanded && (
        <div className="p-4 border-t bg-muted/30 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select defaultValue={task.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="neumorph-light">
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
              <label className="text-sm font-medium">Prioridade</label>
              <Select defaultValue={task.priority} onValueChange={handlePriorityChange}>
                <SelectTrigger className="neumorph-light">
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Urgente" className="text-priority-urgent">Urgente</SelectItem>
                  <SelectItem value="Normal" className="text-priority-normal">Normal</SelectItem>
                  <SelectItem value="Leve" className="text-priority-low">Leve</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-4">
            <Button 
              onClick={() => setBriefingOpen(true)}
              variant="outline"
              className="w-full flex items-center gap-2 neumorph-light hover:neumorph-pressed"
            >
              <FileText className="h-4 w-4" />
              <span>{task.briefing ? "Editar Briefing" : "Adicionar Briefing"}</span>
            </Button>
          </div>
        </div>
      )}
      
      {/* Briefing modal */}
      <TaskBriefing 
        isOpen={briefingOpen} 
        onClose={() => setBriefingOpen(false)} 
        onSave={handleSaveBriefing}
      />
    </div>
  );
};

export default TaskCard;

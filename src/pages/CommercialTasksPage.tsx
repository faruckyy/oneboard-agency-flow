
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TaskCard, { Task } from "@/components/tasks/TaskCard";
import { motion, AnimatePresence } from "framer-motion";

const taskTypes = ["Post", "Roteiro", "Reunião", "Ligação", "Outros"];

const CommercialTasksPage = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Cliente Acme',
      description: 'Post para Instagram sobre lançamento',
      assignedTo: 'Carlos Oliveira',
      status: 'Na fila',
      priority: 'Normal',
    },
    {
      id: '2',
      title: 'Campanha de Black Friday',
      description: 'Roteiro para vídeo promocional',
      assignedTo: 'Ana Costa',
      status: 'Fazendo',
      priority: 'Urgente',
    },
    {
      id: '3',
      title: 'Reunião com Potencial Cliente',
      description: 'Apresentar portfólio e serviços',
      assignedTo: 'Carlos Oliveira',
      status: 'Aguardando Material',
      priority: 'Urgente',
    }
  ]);

  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskType, setNewTaskType] = useState(taskTypes[0]);
  const [newTaskAssignee, setNewTaskAssignee] = useState("Carlos Oliveira");
  
  // Group tasks by assigned person
  const tasksByPerson: Record<string, Task[]> = tasks.reduce((acc, task) => {
    if (!acc[task.assignedTo]) {
      acc[task.assignedTo] = [];
    }
    acc[task.assignedTo].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  const addNewTask = () => {
    if (!newTaskTitle) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      description: `${newTaskType}: ${newTaskDesc || "Sem descrição"}`,
      assignedTo: newTaskAssignee,
      status: "Na fila",
      priority: "Normal",
    };
    
    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
    setNewTaskDesc("");
    setNewTaskOpen(false);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/')}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">
              <span className="flex items-center gap-2">
                <Briefcase className="h-6 w-6 text-primary" />
                Tarefas Comercial e Social Media
              </span>
            </h1>
          </div>
          
          <Button 
            onClick={() => setNewTaskOpen(!newTaskOpen)}
            className="flex items-center gap-2 bg-sidebar text-sidebar-foreground rounded-xl shadow-md"
          >
            <Plus className="h-4 w-4" />
            <span>Nova Tarefa</span>
          </Button>
        </div>
        
        {/* New Task Form */}
        <AnimatePresence>
          {newTaskOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 p-4 border rounded-xl bg-sidebar text-sidebar-foreground shadow-md border-sidebar-border"
            >
              <h2 className="text-lg font-semibold mb-4">Nova Tarefa</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-sidebar-foreground/70">Título</label>
                  <Input 
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Título da tarefa"
                    className="bg-sidebar-accent/50 border-sidebar-border text-sidebar-foreground mt-1"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wider text-sidebar-foreground/70">Tipo</label>
                    <Select value={newTaskType} onValueChange={setNewTaskType}>
                      <SelectTrigger className="bg-sidebar-accent/50 border-sidebar-border text-sidebar-foreground">
                        <SelectValue placeholder="Tipo de tarefa" />
                      </SelectTrigger>
                      <SelectContent>
                        {taskTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wider text-sidebar-foreground/70">Atribuir para</label>
                    <Select value={newTaskAssignee} onValueChange={setNewTaskAssignee}>
                      <SelectTrigger className="bg-sidebar-accent/50 border-sidebar-border text-sidebar-foreground">
                        <SelectValue placeholder="Selecione a pessoa" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Carlos Oliveira">Carlos Oliveira</SelectItem>
                        <SelectItem value="Ana Costa">Ana Costa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-sidebar-foreground/70">Descrição</label>
                  <Input
                    value={newTaskDesc}
                    onChange={(e) => setNewTaskDesc(e.target.value)}
                    placeholder="Breve descrição da tarefa"
                    className="bg-sidebar-accent/50 border-sidebar-border text-sidebar-foreground mt-1"
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setNewTaskOpen(false)}
                    className="border-sidebar-border hover:bg-sidebar-accent text-sidebar-foreground"
                  >
                    Cancelar
                  </Button>
                  <Button onClick={addNewTask}>
                    Criar Tarefa
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Tasks by Person */}
        <div className="space-y-8">
          {Object.entries(tasksByPerson).map(([person, personTasks]) => (
            <motion.div 
              key={person}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                <div className="w-2 h-6 rounded-full bg-primary"></div>
                {person}
              </h2>
              <div className="space-y-3">
                <AnimatePresence>
                  {personTasks.length > 0 ? (
                    personTasks.map(task => (
                      <TaskCard key={task.id} task={task} onUpdate={updateTask} />
                    ))
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-4 text-center text-muted-foreground border border-dashed rounded-xl"
                    >
                      Nenhuma tarefa atribuída a este colaborador
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CommercialTasksPage;


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, Check, Clock, ArrowDownCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CleaningTask {
  id: string;
  personName: string;
  task: string;
  completed: boolean;
  postponed?: boolean;
}

const CleaningPage = () => {
  const navigate = useNavigate();
  const [cycleDate, setCycleDate] = useState(new Date().toLocaleDateString('pt-BR'));
  const [cleaningTasks, setCleaningTasks] = useState<CleaningTask[]>([]);
  const [completedCycles, setCompletedCycles] = useState<{ date: string; tasks: CleaningTask[] }[]>([]);

  // Initialize cleaning tasks
  useEffect(() => {
    // This would typically come from an API
    const mockTasks: CleaningTask[] = [
      { id: '1', personName: 'João Silva', task: 'Limpar a copa', completed: false },
      { id: '2', personName: 'Maria Souza', task: 'Limpar a copa', completed: false },
      { id: '3', personName: 'Carlos Oliveira', task: 'Limpar a copa', completed: false },
      { id: '4', personName: 'Ana Costa', task: 'Limpar a copa', completed: false },
      { id: '5', personName: 'João Silva', task: 'Tirar os lixos', completed: false },
      { id: '6', personName: 'Maria Souza', task: 'Arrumar pratos no armário e lavar a pia', completed: false },
    ];
    
    setCleaningTasks(mockTasks);
    
    // Load saved cycles from localStorage
    const savedCycles = localStorage.getItem('cleaningCycles');
    if (savedCycles) {
      setCompletedCycles(JSON.parse(savedCycles));
    }
  }, []);
  
  // Save cycles to localStorage when updated
  useEffect(() => {
    if (completedCycles.length > 0) {
      localStorage.setItem('cleaningCycles', JSON.stringify(completedCycles));
    }
  }, [completedCycles]);

  const toggleTaskCompleted = (taskId: string) => {
    setCleaningTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
    
    // Check if all tasks are completed
    const updatedTasks = cleaningTasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    
    const allCompleted = updatedTasks.every(task => task.completed);
    
    if (allCompleted) {
      setTimeout(() => {
        // Save to history when all tasks are completed
        setCompletedCycles(prev => [
          { date: cycleDate, tasks: [...updatedTasks] },
          ...prev.slice(0, 29) // Keep only last 30 cycles
        ]);
        
        toast({
          title: "Ciclo de limpeza concluído!",
          description: "Todas as tarefas foram completadas. Um novo ciclo começará em breve.",
        });
      }, 500);
    }
  };

  const postponeTask = (taskId: string) => {
    setCleaningTasks(prevTasks => {
      // Find the task to postpone
      const taskIndex = prevTasks.findIndex(task => task.id === taskId);
      if (taskIndex < 0 || taskIndex === prevTasks.length - 1) return prevTasks;
      
      // Create new array with task moved down one position
      const newTasks = [...prevTasks];
      const taskToMove = { ...newTasks[taskIndex], postponed: true };
      newTasks.splice(taskIndex, 1);
      newTasks.splice(taskIndex + 1, 0, taskToMove);
      
      toast({
        title: "Tarefa adiada",
        description: `A tarefa de ${taskToMove.personName} foi adiada.`,
      });
      
      return newTasks;
    });
  };

  const resetCycle = () => {
    // Reset all tasks without saving to history
    setCleaningTasks(prevTasks => 
      prevTasks.map(task => ({ ...task, completed: false, postponed: false }))
    );
    
    // Set new cycle date
    setCycleDate(new Date().toLocaleDateString('pt-BR'));
    
    toast({
      title: "Ciclo reiniciado",
      description: "Um novo ciclo de limpeza foi iniciado.",
    });
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="animate-fade-in"
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
              <span className="sr-only">Voltar</span>
            </Button>
            <h1 className="text-2xl font-bold">Escala de Limpeza</h1>
          </div>
          
          <Button 
            onClick={resetCycle}
            className="flex items-center gap-2 neumorph-light hover:neumorph-pressed text-sidebar-foreground bg-sidebar rounded-xl shadow-md"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Reiniciar Ciclo</span>
          </Button>
        </div>
        
        <motion.div 
          className="mb-6 p-3 bg-sidebar rounded-xl backdrop-blur-md text-sidebar-foreground shadow-md border border-sidebar-border inline-block"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <div className="text-sm font-medium">
              Ciclo iniciado em: <span className="font-bold">{cycleDate}</span>
            </div>
          </div>
        </motion.div>
        
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <div className="w-2 h-6 rounded-full bg-primary/70"></div>
              Tarefas do Ciclo Atual
            </h2>
            <div className="space-y-3">
              <AnimatePresence>
                {cleaningTasks.map((task, index) => (
                  <motion.div 
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className={cn(
                      "p-4 rounded-xl flex items-center justify-between transition-all bg-sidebar backdrop-blur-md text-sidebar-foreground shadow-md border border-sidebar-border",
                      task.completed ? 'opacity-60' : '',
                      task.postponed ? 'border-l-4 border-l-yellow-500' : ''
                    )}
                  >
                    <div className={task.completed ? 'task-completed' : ''}>
                      <div className="font-medium">{task.personName}</div>
                      <div className="text-sm text-sidebar-foreground/70">{task.task}</div>
                    </div>
                    <div className="flex gap-2">
                      {!task.completed && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => postponeTask(task.id)}
                          className="h-8 p-0 rounded-full text-yellow-400 hover:text-yellow-500 hover:bg-yellow-500/10"
                          title="Adiar tarefa"
                        >
                          <ArrowDownCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant={task.completed ? "default" : "outline"}
                        onClick={() => toggleTaskCompleted(task.id)}
                        className={`min-w-[40px] h-8 p-0 rounded-full transition-all duration-300 ${
                          task.completed 
                            ? "bg-primary text-white" 
                            : "border-dashed hover:border-primary"
                        }`}
                      >
                        <Check className={`h-4 w-4 ${task.completed ? 'text-white' : 'text-muted-foreground'}`} />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <div className="w-2 h-6 rounded-full bg-primary/70"></div>
              Histórico Recente
            </h2>
            <div className="space-y-4 h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence>
                {completedCycles.length > 0 ? (
                  completedCycles.map((cycle, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="p-4 rounded-xl bg-sidebar backdrop-blur-md text-sidebar-foreground shadow-md border border-sidebar-border"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Ciclo concluído em: {cycle.date}</h3>
                        <span className="text-xs px-2 py-1 bg-green-500/20 text-green-500 rounded-full font-medium">
                          Concluído
                        </span>
                      </div>
                      <div className="text-sm text-sidebar-foreground/70">
                        {cycle.tasks.filter(t => t.completed).length} de {cycle.tasks.length} tarefas concluídas
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 text-center text-muted-foreground border border-dashed rounded-xl"
                  >
                    Ainda não há ciclos concluídos no histórico.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CleaningPage;

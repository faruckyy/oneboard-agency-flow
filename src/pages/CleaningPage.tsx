
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface CleaningTask {
  id: string;
  personName: string;
  task: string;
  completed: boolean;
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
  }, []);

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
        toast({
          title: "Ciclo de limpeza concluído!",
          description: "Todas as tarefas foram completadas. Um novo ciclo começará em breve.",
        });
      }, 500);
    }
  };

  const resetCycle = () => {
    // Save current cycle to history before resetting
    if (cleaningTasks.some(task => task.completed)) {
      setCompletedCycles(prev => [
        { date: cycleDate, tasks: [...cleaningTasks] },
        ...prev.slice(0, 29) // Keep only last 30 cycles
      ]);
    }
    
    // Reset all tasks
    setCleaningTasks(prevTasks => 
      prevTasks.map(task => ({ ...task, completed: false }))
    );
    
    // Set new cycle date
    setCycleDate(new Date().toLocaleDateString('pt-BR'));
    
    toast({
      title: "Ciclo reiniciado",
      description: "Um novo ciclo de limpeza foi iniciado.",
    });
  };

  return (
    <div className="animate-fade-in">
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
          className="flex items-center gap-2 neumorph-light hover:neumorph-pressed"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Reiniciar Ciclo</span>
        </Button>
      </div>
      
      <div className="mb-2 text-sm text-muted-foreground">
        Ciclo iniciado em: {cycleDate}
      </div>
      
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Tarefas do Ciclo Atual</h2>
          <div className="space-y-3">
            {cleaningTasks.map(task => (
              <div 
                key={task.id}
                className={`p-4 rounded-lg flex items-center justify-between transition-all neumorph-light ${task.completed ? 'opacity-60' : ''}`}
              >
                <div className={task.completed ? 'task-completed' : ''}>
                  <div className="font-medium">{task.personName}</div>
                  <div className="text-sm text-muted-foreground">{task.task}</div>
                </div>
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
            ))}
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Histórico Recente</h2>
          {completedCycles.length > 0 ? (
            <div className="space-y-4">
              {completedCycles.map((cycle, index) => (
                <div key={index} className="p-4 rounded-lg neumorph-light">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Ciclo concluído em: {cycle.date}</h3>
                    <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-full">
                      Concluído
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {cycle.tasks.filter(t => t.completed).length} de {cycle.tasks.length} tarefas concluídas
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground border border-dashed rounded-lg">
              Ainda não há ciclos concluídos no histórico.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CleaningPage;

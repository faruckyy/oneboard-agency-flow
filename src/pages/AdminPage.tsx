
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

interface Person {
  id: string;
  name: string;
  role: "Designer" | "Comercial" | "Social Media";
}

const AdminPage = () => {
  const navigate = useNavigate();
  const [people, setPeople] = useState<Person[]>([
    { id: '1', name: 'João Silva', role: 'Designer' },
    { id: '2', name: 'Maria Souza', role: 'Designer' },
    { id: '3', name: 'Carlos Oliveira', role: 'Comercial' },
    { id: '4', name: 'Ana Costa', role: 'Social Media' },
  ]);
  const [newPersonName, setNewPersonName] = useState("");
  const [newPersonRole, setNewPersonRole] = useState<"Designer" | "Comercial" | "Social Media">("Designer");
  
  const [cycleDuration, setCycleDuration] = useState("7");
  const [cleaningTasks, setCleaningTasks] = useState([
    "Tirar os lixos",
    "Limpar a copa",
    "Arrumar pratos no armário e lavar a pia"
  ]);
  const [newTask, setNewTask] = useState("");

  const handleAddPerson = () => {
    if (!newPersonName) return;
    
    const newPerson: Person = {
      id: Date.now().toString(),
      name: newPersonName,
      role: newPersonRole,
    };
    
    setPeople([...people, newPerson]);
    setNewPersonName("");
    toast({
      title: "Pessoa adicionada",
      description: `${newPersonName} foi adicionado(a) com sucesso.`,
    });
  };

  const handleDeletePerson = (id: string) => {
    setPeople(people.filter(person => person.id !== id));
    toast({
      title: "Pessoa removida",
      description: "A pessoa foi removida com sucesso.",
    });
  };

  const handleAddTask = () => {
    if (!newTask) return;
    setCleaningTasks([...cleaningTasks, newTask]);
    setNewTask("");
  };

  const handleDeleteTask = (index: number) => {
    setCleaningTasks(cleaningTasks.filter((_, i) => i !== index));
  };

  const handleSaveSettings = () => {
    // Here you would typically save these settings to a database
    toast({
      title: "Configurações salvas",
      description: "As configurações foram salvas com sucesso.",
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/')}
          className="mr-3 rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Painel de Administração</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* People Management */}
        <div className="space-y-6 p-6 rounded-xl neumorph-light">
          <h2 className="text-xl font-semibold">Gerenciar Pessoas</h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nome</label>
              <Input 
                value={newPersonName}
                onChange={(e) => setNewPersonName(e.target.value)}
                placeholder="Nome da pessoa"
                className="neumorph-light focus:neumorph-pressed"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Função</label>
              <Select 
                value={newPersonRole} 
                onValueChange={(value) => setNewPersonRole(value as any)}
              >
                <SelectTrigger className="neumorph-light">
                  <SelectValue placeholder="Selecione a função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Designer">Designer</SelectItem>
                  <SelectItem value="Comercial">Comercial</SelectItem>
                  <SelectItem value="Social Media">Social Media</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={handleAddPerson}
              className="w-full flex items-center justify-center gap-2 neumorph-light hover:neumorph-pressed"
            >
              <Plus className="h-4 w-4" />
              <span>Adicionar Pessoa</span>
            </Button>
          </div>
          
          <div className="mt-8">
            <h3 className="font-medium mb-3">Lista de Pessoas</h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {people.map(person => (
                <div 
                  key={person.id}
                  className="p-3 rounded-lg bg-background flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium">{person.name}</div>
                    <div className="text-sm text-muted-foreground">{person.role}</div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDeletePerson(person.id)}
                    className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Cleaning Settings */}
        <div className="space-y-6 p-6 rounded-xl neumorph-light">
          <h2 className="text-xl font-semibold">Configurações de Limpeza</h2>
          
          <div>
            <label className="text-sm font-medium">Duração do Ciclo (dias)</label>
            <Input 
              type="number"
              value={cycleDuration}
              onChange={(e) => setCycleDuration(e.target.value)}
              min="1"
              max="31"
              className="neumorph-light focus:neumorph-pressed"
            />
          </div>
          
          <Button 
            onClick={handleSaveSettings}
            className="w-full flex items-center justify-center gap-2"
          >
            <Save className="h-4 w-4" />
            <span>Salvar Configurações</span>
          </Button>
          
          <div className="mt-8">
            <h3 className="font-medium mb-3">Tarefas de Limpeza</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Estas são tarefas fixas que são atribuídas automaticamente em cada ciclo de limpeza.
            </p>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Nova tarefa de limpeza"
                  className="neumorph-light focus:neumorph-pressed"
                />
                <Button 
                  onClick={handleAddTask}
                  size="icon"
                  className="neumorph-light hover:neumorph-pressed"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                {cleaningTasks.map((task, index) => (
                  <div 
                    key={index}
                    className="p-3 rounded-lg bg-background flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-4 bg-primary rounded"></div>
                      <span>{task}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteTask(index)}
                      className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;

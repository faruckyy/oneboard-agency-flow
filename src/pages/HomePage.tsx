
import { useNavigate } from "react-router-dom";
import { Brush, LineChart, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: "Limpeza",
      description: "Gerenciamento de escalas e tarefas de limpeza",
      path: "/cleaning",
      icon: ClipboardList,
      gradient: "from-green-400 to-emerald-500"
    },
    {
      title: "Tarefas Designers",
      description: "Gerenciamento de projetos da equipe de design",
      path: "/design",
      icon: Brush,
      gradient: "from-blue-400 to-indigo-500"
    },
    {
      title: "Tarefas Comercial e Social Media",
      description: "Controle de tarefas para equipe comercial e social media",
      path: "/commercial",
      icon: LineChart,
      gradient: "from-amber-400 to-orange-500"
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-in">
        <h1 className="mb-4 text-4xl font-bold sm:text-5xl">
          <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            OneBoard
          </span>
        </h1>
        <p className="text-lg text-muted-foreground">
          Gerencie todos os aspectos da sua agência em um só lugar
        </p>
      </div>
      
      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((section, index) => (
          <div
            key={section.path}
            onClick={() => navigate(section.path)}
            className={cn(
              "group cursor-pointer p-6 transition-all duration-300 animate-fade-in",
              "hover:scale-[1.02] active:scale-[0.98] rounded-xl overflow-hidden relative",
              "neumorph-light"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="absolute top-0 right-0 w-20 h-20 -mr-6 -mt-6 rounded-full opacity-10 bg-gradient-to-br" style={{background: `linear-gradient(225deg, var(--primary), transparent)`}} />
            
            <section.icon className={`mb-4 h-12 w-12 p-2 rounded-lg bg-gradient-to-r ${section.gradient} text-white`} />
            
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
        ))}
      </div>
    </div>
  );
};

export default HomePage;


import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6 p-8 max-w-md neumorph-light rounded-xl animate-fade-in">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <p className="text-xl text-muted-foreground mb-4">Oops! Página não encontrada</p>
        <p className="text-muted-foreground">
          A página que você está procurando não existe ou foi removida.
        </p>
        <Button 
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-base"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Voltar para Home</span>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;

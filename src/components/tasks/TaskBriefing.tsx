
import { useState } from "react";
import { X, Plus, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

interface TaskBriefingProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: BriefingData) => void;
}

export interface BriefingData {
  title: string;
  subtitle: string;
  description: string;
  links: string[];
  visualReferences: string[];
}

const TaskBriefing = ({ isOpen, onClose, onSave }: TaskBriefingProps) => {
  const [formData, setFormData] = useState<BriefingData>({
    title: "",
    subtitle: "",
    description: "",
    links: [],
    visualReferences: [],
  });
  
  const [newLink, setNewLink] = useState("");
  const [newRef, setNewRef] = useState("");

  if (!isOpen) return null;

  const handleAddLink = () => {
    if (!newLink) return;
    setFormData({
      ...formData,
      links: [...formData.links, newLink],
    });
    setNewLink("");
  };

  const handleRemoveLink = (index: number) => {
    setFormData({
      ...formData,
      links: formData.links.filter((_, i) => i !== index),
    });
  };

  const handleAddVisualRef = () => {
    if (!newRef) return;
    setFormData({
      ...formData,
      visualReferences: [...formData.visualReferences, newRef],
    });
    setNewRef("");
  };

  const handleRemoveVisualRef = (index: number) => {
    setFormData({
      ...formData,
      visualReferences: formData.visualReferences.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = () => {
    // At minimum, we need a title
    if (!formData.title) {
      toast({
        title: "Título obrigatório",
        description: "Por favor, adicione um título para o briefing.",
        variant: "destructive",
      });
      return;
    }

    onSave(formData);
    onClose();
    
    toast({
      title: "Briefing salvo",
      description: "O briefing foi salvo com sucesso!",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm modal-overlay" onClick={onClose} />
      
      {/* Modal */}
      <div className="bg-background rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto modal-content p-6 relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Briefing</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Título (Headline 1)
            </label>
            <Input
              id="title"
              placeholder="Qual o título do material?"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="neumorph-light focus:neumorph-pressed"
            />
          </div>
          
          {/* Subtitle */}
          <div className="space-y-2">
            <label htmlFor="subtitle" className="text-sm font-medium">
              Subtítulo (Headline 2)
            </label>
            <Input
              id="subtitle"
              placeholder="Qual o subtítulo do material?"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              className="neumorph-light focus:neumorph-pressed"
            />
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Descrição
            </label>
            <Textarea
              id="description"
              placeholder="Descreva o material..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="neumorph-light focus:neumorph-pressed resize-none"
            />
          </div>
          
          {/* Links */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Links</label>
            <div className="flex gap-2">
              <Input
                placeholder="Cole um link aqui"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                className="neumorph-light focus:neumorph-pressed"
              />
              <Button onClick={handleAddLink} size="icon" variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2 mt-2">
              {formData.links.map((link, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                  <span className="text-sm truncate">{link}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveLink(index)}
                    className="h-6 w-6"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          {/* File Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Arquivos</label>
            <div 
              className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <Paperclip className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm font-medium">Clique para anexar arquivos</p>
              <p className="text-xs text-muted-foreground">(máximo 60MB)</p>
            </div>
          </div>
          
          {/* Visual References */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Referências Visuais</label>
            <div className="flex gap-2">
              <Input
                placeholder="URL da referência visual"
                value={newRef}
                onChange={(e) => setNewRef(e.target.value)}
                className="neumorph-light focus:neumorph-pressed"
              />
              <Button onClick={handleAddVisualRef} size="icon" variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2 mt-2">
              {formData.visualReferences.map((ref, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                  <span className="text-sm truncate">{ref}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveVisualRef(index)}
                    className="h-6 w-6"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-end gap-2 mt-8">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            Salvar Briefing
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskBriefing;

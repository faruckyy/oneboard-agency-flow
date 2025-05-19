
import { useState, useEffect } from "react";
import { X, Plus, Paperclip, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface TaskBriefingProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: BriefingData) => void;
  initialData?: BriefingData;
}

export interface BriefingData {
  title: string;
  subtitle: string;
  description: string;
  links: string[];
  visualReferences: string[];
}

const initialBriefingData: BriefingData = {
  title: "",
  subtitle: "",
  description: "",
  links: [],
  visualReferences: [],
};

const TaskBriefing = ({ isOpen, onClose, onSave, initialData }: TaskBriefingProps) => {
  const [formData, setFormData] = useState<BriefingData>(initialBriefingData);
  const [newLink, setNewLink] = useState("");
  const [newRef, setNewRef] = useState("");
  
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(initialBriefingData);
    }
  }, [initialData, isOpen]);

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
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm modal-overlay" 
        onClick={onClose} 
      />
      
      {/* Modal */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="bg-sidebar rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto modal-content p-6 relative z-10 border border-sidebar-border text-sidebar-foreground"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">Briefing</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-sidebar-accent/50">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-xs font-medium uppercase tracking-wider text-sidebar-foreground/70">
              Título (Headline 1)
            </label>
            <Input
              id="title"
              placeholder="Qual o título do material?"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-sidebar-accent/50 border-sidebar-border text-sidebar-foreground focus:ring-primary"
            />
          </div>
          
          {/* Subtitle */}
          <div className="space-y-2">
            <label htmlFor="subtitle" className="text-xs font-medium uppercase tracking-wider text-sidebar-foreground/70">
              Subtítulo (Headline 2)
            </label>
            <Input
              id="subtitle"
              placeholder="Qual o subtítulo do material?"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              className="bg-sidebar-accent/50 border-sidebar-border text-sidebar-foreground focus:ring-primary"
            />
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-xs font-medium uppercase tracking-wider text-sidebar-foreground/70">
              Descrição
            </label>
            <Textarea
              id="description"
              placeholder="Descreva o material..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="bg-sidebar-accent/50 border-sidebar-border text-sidebar-foreground focus:ring-primary resize-none"
            />
          </div>
          
          {/* Links */}
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wider text-sidebar-foreground/70">Links</label>
            <div className="flex gap-2">
              <Input
                placeholder="Cole um link aqui"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                className="bg-sidebar-accent/50 border-sidebar-border text-sidebar-foreground focus:ring-primary"
              />
              <Button 
                onClick={handleAddLink} 
                size="icon" 
                variant="ghost"
                className="bg-sidebar-accent/50 hover:bg-sidebar-accent rounded-lg"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2 mt-2">
              <AnimatePresence>
                {formData.links.map((link, index) => (
                  <motion.div 
                    key={index + link}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center justify-between p-2 bg-sidebar-accent/30 rounded-lg"
                  >
                    <div className="flex items-center gap-2 text-sm truncate">
                      <LinkIcon className="h-3 w-3 flex-shrink-0 text-primary" />
                      <span className="truncate">{link}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveLink(index)}
                      className="h-6 w-6 rounded-full hover:bg-sidebar-accent"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
          
          {/* File Upload */}
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wider text-sidebar-foreground/70">Arquivos</label>
            <div 
              className="border border-dashed border-sidebar-border rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-sidebar-accent/50 transition-colors bg-sidebar-accent/20"
            >
              <Paperclip className="h-10 w-10 text-sidebar-foreground/50 mb-2" />
              <p className="text-sm font-medium">Clique para anexar arquivos</p>
              <p className="text-xs text-sidebar-foreground/70">(máximo 60MB)</p>
            </div>
          </div>
          
          {/* Visual References */}
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wider text-sidebar-foreground/70">Referências Visuais</label>
            <div className="flex gap-2">
              <Input
                placeholder="URL da referência visual"
                value={newRef}
                onChange={(e) => setNewRef(e.target.value)}
                className="bg-sidebar-accent/50 border-sidebar-border text-sidebar-foreground focus:ring-primary"
              />
              <Button 
                onClick={handleAddVisualRef} 
                size="icon" 
                variant="ghost"
                className="bg-sidebar-accent/50 hover:bg-sidebar-accent rounded-lg"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2 mt-2">
              <AnimatePresence>
                {formData.visualReferences.map((ref, index) => (
                  <motion.div 
                    key={index + ref}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center justify-between p-2 bg-sidebar-accent/30 rounded-lg"
                  >
                    <span className="text-sm truncate">{ref}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveVisualRef(index)}
                      className="h-6 w-6 rounded-full hover:bg-sidebar-accent"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-end gap-2 mt-8">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-sidebar-border hover:bg-sidebar-accent text-sidebar-foreground"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-primary hover:bg-primary/90"
          >
            Salvar Briefing
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default TaskBriefing;

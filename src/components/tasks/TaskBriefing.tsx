
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Plus, Paperclip, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { appleEasing, appleDuration } from "@/utils/animation";

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
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Track element to return focus to when modal closes
  const returnFocusRef = useRef<HTMLElement | null>(null);
  
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(initialBriefingData);
    }
  }, [initialData, isOpen]);

  // Manage focus and prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      returnFocusRef.current = document.activeElement as HTMLElement;
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Focus the modal
      setTimeout(() => {
        modalRef.current?.focus();
      }, 100);
    } else {
      // Restore scroll
      document.body.style.overflow = 'unset';
      
      // Return focus to the previous element
      setTimeout(() => {
        returnFocusRef.current?.focus();
      }, 100);
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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
      title: "Briefing salvo com sucesso",
      description: "Todas as informações foram armazenadas.",
      className: "bg-green-500/90 text-white border-green-600",
    });
  };

  // Use portal to render modal at the root level of the DOM
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with macOS-style blur */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: appleDuration.standard, ease: appleEasing.standard }}
            className="fixed inset-0 bg-black/30 backdrop-blur-md z-50" 
            onClick={onClose} 
            aria-hidden="true"
          />
          
          {/* Modal with enhanced macOS-inspired design */}
          <motion.div 
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 30 
            }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-4xl max-h-[90vh] overflow-y-auto z-50 bg-background/95 dark:bg-sidebar/95 rounded-2xl shadow-2xl border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            {/* macOS-style header */}
            <div className="sticky top-0 z-10 bg-background/80 dark:bg-sidebar/80 backdrop-blur-lg px-6 py-4 border-b border-border/50 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-2">
                <div onClick={onClose} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer transition-colors" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              
              <h2 id="modal-title" className="text-xl font-semibold text-center flex-1 bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent font-display">
                Briefing
              </h2>
              
              <Button 
                onClick={onClose} 
                variant="ghost" 
                size="icon" 
                className="rounded-full hover:bg-background/60 dark:hover:bg-sidebar-accent/50"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Content with improved styling */}
            <div className="p-6 space-y-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Título Principal
                  </label>
                  <Input
                    id="title"
                    placeholder="Qual o título do material?"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-background/20 dark:bg-sidebar-accent/20 backdrop-blur-sm border-border focus:ring-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="subtitle" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Subtítulo
                  </label>
                  <Input
                    id="subtitle"
                    placeholder="Qual o subtítulo do material?"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="bg-background/20 dark:bg-sidebar-accent/20 backdrop-blur-sm border-border focus:ring-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="description" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Descrição
                  </label>
                  <Textarea
                    id="description"
                    placeholder="Descreva o material..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={5}
                    className="bg-background/20 dark:bg-sidebar-accent/20 backdrop-blur-sm border-border focus:ring-primary resize-none"
                  />
                </div>
              </div>
              
              {/* Links section - Bento-inspired grid layout */}
              <div className="bg-background/30 dark:bg-sidebar-accent/10 backdrop-blur-md p-6 rounded-xl border border-border/50 shadow-sm">
                <h3 className="text-lg font-medium mb-4">Links</h3>
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Cole um link aqui"
                    value={newLink}
                    onChange={(e) => setNewLink(e.target.value)}
                    className="bg-background/50 dark:bg-sidebar-accent/30 border-border"
                  />
                  <Button 
                    onClick={handleAddLink} 
                    size="icon" 
                    variant="secondary"
                    className="rounded-lg hover:bg-background/70 dark:hover:bg-sidebar-accent/50"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  <AnimatePresence>
                    {formData.links.map((link, index) => (
                      <motion.div 
                        key={`${index}-${link}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: appleDuration.standard, ease: appleEasing.standard }}
                        className="flex items-center justify-between p-3 bg-background/40 dark:bg-sidebar-accent/20 backdrop-blur-sm rounded-lg border border-border/50"
                      >
                        <div className="flex items-center gap-2 text-sm truncate">
                          <LinkIcon className="h-3 w-3 flex-shrink-0 text-primary" />
                          <span className="truncate">{link}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveLink(index)}
                          className="h-6 w-6 rounded-full hover:bg-background/60 dark:hover:bg-sidebar-accent/40"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
              
              {/* File Upload - Bento-inspired card */}
              <div className="bg-background/30 dark:bg-sidebar-accent/10 backdrop-blur-md p-6 rounded-xl border border-border/50 shadow-sm">
                <h3 className="text-lg font-medium mb-4">Arquivos</h3>
                <div 
                  className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-background/40 dark:hover:bg-sidebar-accent/20"
                >
                  <Paperclip className="h-12 w-12 text-muted-foreground mb-3" />
                  <p className="text-base font-medium">Clique para anexar arquivos</p>
                  <p className="text-sm text-muted-foreground mt-1">(máximo 60MB)</p>
                </div>
              </div>
              
              {/* Visual References - Bento-inspired layout */}
              <div className="bg-background/30 dark:bg-sidebar-accent/10 backdrop-blur-md p-6 rounded-xl border border-border/50 shadow-sm">
                <h3 className="text-lg font-medium mb-4">Referências Visuais</h3>
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="URL da referência visual"
                    value={newRef}
                    onChange={(e) => setNewRef(e.target.value)}
                    className="bg-background/50 dark:bg-sidebar-accent/30 border-border"
                  />
                  <Button 
                    onClick={handleAddVisualRef} 
                    size="icon" 
                    variant="secondary"
                    className="rounded-lg hover:bg-background/70 dark:hover:bg-sidebar-accent/50"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  <AnimatePresence>
                    {formData.visualReferences.map((ref, index) => (
                      <motion.div 
                        key={`${index}-${ref}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: appleDuration.standard, ease: appleEasing.standard }}
                        className="flex items-center justify-between p-3 bg-background/40 dark:bg-sidebar-accent/20 backdrop-blur-sm rounded-lg border border-border/50"
                      >
                        <span className="text-sm truncate">{ref}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveVisualRef(index)}
                          className="h-6 w-6 rounded-full hover:bg-background/60 dark:hover:bg-sidebar-accent/40"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
            
            {/* Footer with MacOS-style action buttons */}
            <div className="sticky bottom-0 z-10 bg-background/80 dark:bg-sidebar/80 backdrop-blur-lg px-6 py-4 border-t border-border/50 flex justify-end gap-3 rounded-b-2xl">
              <Button 
                variant="outline" 
                onClick={onClose}
                className="rounded-full px-6 border-border hover:bg-background/60 dark:hover:bg-sidebar-accent/30"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSubmit}
                className="bg-primary hover:bg-primary/90 rounded-full px-6"
              >
                Salvar Briefing
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default TaskBriefing;

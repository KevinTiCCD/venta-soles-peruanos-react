
import { useState, useEffect } from 'react';
import Dashboard from '@/components/Layout/Dashboard';
import ConceptForm from '@/components/concepts/ConceptForm';
import ConceptList from '@/components/concepts/ConceptList';
import { Concept } from '@/utils/types';
import { getConcepts, create, update, remove } from '@/utils/storage';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

const ConceptsPage = () => {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentConcept, setCurrentConcept] = useState<Concept | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadConcepts();
  }, []);

  const loadConcepts = () => {
    const loadedConcepts = getConcepts();
    setConcepts(loadedConcepts);
  };

  const handleCreateConcept = (concept: Omit<Concept, 'id' | 'createdAt'>) => {
    create<Concept>('concept', concept as Concept);
    toast({
      title: 'Concepto creado',
      description: 'El concepto ha sido creado exitosamente',
    });
    loadConcepts();
    setIsFormOpen(false);
  };

  const handleUpdateConcept = (concept: Concept) => {
    update<Concept>('concept', concept);
    toast({
      title: 'Concepto actualizado',
      description: 'Los datos del concepto han sido actualizados',
    });
    loadConcepts();
    setIsFormOpen(false);
    setCurrentConcept(null);
  };

  const handleDeleteConcept = (id: string) => {
    remove<Concept>('concept', id);
    toast({
      title: 'Concepto eliminado',
      description: 'El concepto ha sido eliminado correctamente',
    });
    loadConcepts();
  };

  const handleEditConcept = (concept: Concept) => {
    setCurrentConcept(concept);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setCurrentConcept(null);
    setIsFormOpen(true);
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setCurrentConcept(null);
  };

  return (
    <Dashboard title="Gestión de Conceptos">
      <div className="mb-6 flex justify-between items-center">
        <p className="text-muted-foreground">
          Administra los conceptos de venta
        </p>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Concepto
        </Button>
      </div>

      {isFormOpen ? (
        <ConceptForm
          concept={currentConcept}
          onSubmit={currentConcept ? handleUpdateConcept : handleCreateConcept}
          onCancel={handleCancelForm}
        />
      ) : (
        <ConceptList
          concepts={concepts}
          onEdit={handleEditConcept}
          onDelete={handleDeleteConcept}
        />
      )}
    </Dashboard>
  );
};

export default ConceptsPage;

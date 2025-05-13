
import { useState, useEffect } from 'react';
import { Concept } from '@/utils/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ConceptFormProps {
  concept: Concept | null;
  onSubmit: (concept: Concept | Omit<Concept, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const ConceptForm = ({ concept, onSubmit, onCancel }: ConceptFormProps) => {
  const [formData, setFormData] = useState<Omit<Concept, 'id' | 'createdAt'>>({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (concept) {
      setFormData({
        name: concept.name,
        description: concept.description || '',
      });
    }
  }, [concept]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (concept) {
      onSubmit({ ...formData, id: concept.id, createdAt: concept.createdAt });
    } else {
      onSubmit(formData);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{concept ? 'Editar Concepto' : 'Nuevo Concepto'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre *</Label>
            <Input 
              id="name"
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="Nombre del concepto"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea 
              id="description"
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              placeholder="Descripción detallada del concepto"
              rows={4}
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {concept ? 'Actualizar' : 'Guardar'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ConceptForm;

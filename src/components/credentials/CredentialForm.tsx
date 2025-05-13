
import { useState, useEffect } from 'react';
import { Credential } from '@/utils/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface CredentialFormProps {
  credential: Credential | null;
  onSubmit: (credential: Credential | Omit<Credential, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const CredentialForm = ({ credential, onSubmit, onCancel }: CredentialFormProps) => {
  const [formData, setFormData] = useState<Omit<Credential, 'id' | 'createdAt'>>({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (credential) {
      setFormData({
        name: credential.name,
        description: credential.description || '',
      });
    }
  }, [credential]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (credential) {
      onSubmit({ ...formData, id: credential.id, createdAt: credential.createdAt });
    } else {
      onSubmit(formData);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{credential ? 'Editar Credencial' : 'Nueva Credencial'}</CardTitle>
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
              placeholder="Nombre de la credencial"
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
              placeholder="Descripción detallada de la credencial"
              rows={4}
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {credential ? 'Actualizar' : 'Guardar'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CredentialForm;

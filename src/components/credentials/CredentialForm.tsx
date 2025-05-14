
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
  const [formData, setFormData] = useState<Omit<Credential, 'id' | 'createdAt'> & { password?: string }>({
    name: '',
    description: '',
    password: ''
  });

  useEffect(() => {
    if (credential) {
      setFormData({
        name: credential.name,
        description: credential.description || '',
        password: ''
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
    
    // Eliminar el campo password si está vacío para que no quede en el objeto final
    const submitData = {...formData};
    if (!submitData.password) {
      delete submitData.password;
    }
    
    if (credential) {
      onSubmit({ ...submitData, id: credential.id, createdAt: credential.createdAt });
    } else {
      onSubmit(submitData);
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
            <Label htmlFor="name">Nombre de Usuario *</Label>
            <Input 
              id="name"
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="Nombre de usuario para acceso"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña {credential ? '(Dejar en blanco para mantener la actual)' : '*'}</Label>
            <Input 
              id="password"
              name="password" 
              type="password"
              value={formData.password} 
              onChange={handleChange} 
              placeholder={credential ? "••••••••" : "Contraseña para acceso"}
              required={!credential}
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

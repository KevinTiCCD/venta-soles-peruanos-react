
import { useState, useEffect } from 'react';
import { Client } from '@/utils/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface ClientFormProps {
  client: Client | null;
  onSubmit: (client: Client | Omit<Client, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const ClientForm = ({ client, onSubmit, onCancel }: ClientFormProps) => {
  const [formData, setFormData] = useState<Omit<Client, 'id' | 'createdAt'>>({
    name: '',
    document: '',
    phone: '',
    email: '',
    address: '',
  });

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name,
        document: client.document,
        phone: client.phone || '',
        email: client.email || '',
        address: client.address || '',
      });
    }
  }, [client]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (client) {
      onSubmit({ ...formData, id: client.id, createdAt: client.createdAt });
    } else {
      onSubmit(formData);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{client ? 'Editar Cliente' : 'Nuevo Cliente'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo *</Label>
              <Input 
                id="name"
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="Nombre completo"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="document">Documento de identidad *</Label>
              <Input 
                id="document"
                name="document" 
                value={formData.document} 
                onChange={handleChange} 
                placeholder="DNI / RUC"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input 
                id="phone"
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                placeholder="Teléfono de contacto"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input 
                id="email"
                name="email" 
                type="email"
                value={formData.email} 
                onChange={handleChange} 
                placeholder="correo@ejemplo.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Dirección</Label>
            <Input 
              id="address"
              name="address" 
              value={formData.address} 
              onChange={handleChange} 
              placeholder="Dirección completa"
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {client ? 'Actualizar' : 'Guardar'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ClientForm;

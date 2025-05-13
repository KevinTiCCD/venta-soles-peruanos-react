
import { useState, useEffect } from 'react';
import { Sale } from '@/utils/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getClients, getSellers, getConcepts } from '@/utils/storage';

interface SaleFormProps {
  onSubmit: (sale: Omit<Sale, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const SaleForm = ({ onSubmit, onCancel }: SaleFormProps) => {
  const [clients, setClients] = useState<{ id: string; name: string }[]>([]);
  const [sellers, setSellers] = useState<{ id: string; name: string }[]>([]);
  const [concepts, setConcepts] = useState<{ id: string; name: string }[]>([]);

  const [formData, setFormData] = useState<Omit<Sale, 'id' | 'createdAt'>>({
    date: new Date(),
    clientId: '',
    sellerId: '',
    conceptId: '',
    observation: '',
    amount: 0,
  });

  useEffect(() => {
    // Load all required data
    setClients(getClients().map(c => ({ id: c.id, name: c.name })));
    setSellers(getSellers().map(s => ({ id: s.id, name: s.name })));
    setConcepts(getConcepts().map(c => ({ id: c.id, name: c.name })));
    
    // Set current date and time
    const now = new Date();
    const formattedDate = now.toISOString().substring(0, 16);
    setFormData(prev => ({ ...prev, date: now }));
  }, []);
  
  const formatDateForInput = (date: Date): string => {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    return date.toISOString().slice(0, 16);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'amount') {
      // Handle amount as number
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else if (name === 'date') {
      // Convert string date to Date object
      setFormData(prev => ({ ...prev, [name]: new Date(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Registrar Nueva Venta</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Fecha y hora *</Label>
              <Input 
                id="date"
                name="date" 
                type="datetime-local"
                value={formatDateForInput(formData.date)} 
                onChange={handleChange} 
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Monto (S/) *</Label>
              <Input 
                id="amount"
                name="amount" 
                type="number"
                step="0.01"
                min="0"
                value={formData.amount || ''} 
                onChange={handleChange} 
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientId">Cliente *</Label>
            <Select
              value={formData.clientId}
              onValueChange={(value) => handleSelectChange('clientId', value)}
              required
            >
              <SelectTrigger id="clientId">
                <SelectValue placeholder="Seleccionar cliente" />
              </SelectTrigger>
              <SelectContent>
                {clients.map(client => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sellerId">Vendedor *</Label>
            <Select
              value={formData.sellerId}
              onValueChange={(value) => handleSelectChange('sellerId', value)}
              required
            >
              <SelectTrigger id="sellerId">
                <SelectValue placeholder="Seleccionar vendedor" />
              </SelectTrigger>
              <SelectContent>
                {sellers.map(seller => (
                  <SelectItem key={seller.id} value={seller.id}>
                    {seller.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="conceptId">Concepto *</Label>
            <Select
              value={formData.conceptId}
              onValueChange={(value) => handleSelectChange('conceptId', value)}
              required
            >
              <SelectTrigger id="conceptId">
                <SelectValue placeholder="Seleccionar concepto" />
              </SelectTrigger>
              <SelectContent>
                {concepts.map(concept => (
                  <SelectItem key={concept.id} value={concept.id}>
                    {concept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observation">Observación</Label>
            <Textarea 
              id="observation"
              name="observation" 
              value={formData.observation} 
              onChange={handleChange} 
              placeholder="Detalles adicionales sobre la venta"
              rows={3}
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            Registrar Venta
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default SaleForm;

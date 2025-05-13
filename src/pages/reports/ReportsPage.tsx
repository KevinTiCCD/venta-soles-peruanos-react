
import { useState, useEffect } from 'react';
import Dashboard from '@/components/Layout/Dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getSales, getClients, getSellers, getConcepts } from '@/utils/storage';
import { formatCurrency } from '@/utils/printUtils';
import { Sale } from '@/utils/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText } from 'lucide-react';

const ReportsPage = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [filteredSales, setFilteredSales] = useState<Sale[]>([]);
  const [clients, setClients] = useState<{ id: string; name: string }[]>([]);
  const [sellers, setSellers] = useState<{ id: string; name: string }[]>([]);
  const [concepts, setConcepts] = useState<{ id: string; name: string }[]>([]);
  
  // Filter states
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [clientId, setClientId] = useState<string>('');
  const [sellerId, setSellerId] = useState<string>('');
  const [conceptId, setConceptId] = useState<string>('');

  useEffect(() => {
    // Load data
    const loadedSales = getSales();
    setSales(loadedSales);
    setFilteredSales(loadedSales);
    
    setClients(getClients().map(c => ({ id: c.id, name: c.name })));
    setSellers(getSellers().map(s => ({ id: s.id, name: s.name })));
    setConcepts(getConcepts().map(c => ({ id: c.id, name: c.name })));
    
    // Set default date range to current month
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    
    setStartDate(firstDay.toISOString().split('T')[0]);
    setEndDate(lastDay.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [startDate, endDate, clientId, sellerId, conceptId]);

  const applyFilters = () => {
    let filtered = [...sales];
    
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      filtered = filtered.filter(sale => new Date(sale.date) >= start);
    }
    
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter(sale => new Date(sale.date) <= end);
    }
    
    if (clientId) {
      filtered = filtered.filter(sale => sale.clientId === clientId);
    }
    
    if (sellerId) {
      filtered = filtered.filter(sale => sale.sellerId === sellerId);
    }
    
    if (conceptId) {
      filtered = filtered.filter(sale => sale.conceptId === conceptId);
    }
    
    // Sort by date descending
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setFilteredSales(filtered);
  };

  const handleResetFilters = () => {
    setClientId('');
    setSellerId('');
    setConceptId('');
    
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    
    setStartDate(firstDay.toISOString().split('T')[0]);
    setEndDate(lastDay.toISOString().split('T')[0]);
  };

  const totalAmount = filteredSales.reduce((sum, sale) => sum + sale.amount, 0);

  const getClientName = (id: string) => {
    const client = clients.find(c => c.id === id);
    return client ? client.name : 'Cliente no encontrado';
  };

  const getSellerName = (id: string) => {
    const seller = sellers.find(s => s.id === id);
    return seller ? seller.name : 'Vendedor no encontrado';
  };

  const getConceptName = (id: string) => {
    const concept = concepts.find(c => c.id === id);
    return concept ? concept.name : 'Concepto no encontrado';
  };

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dashboard title="Reportes">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Filtros de Reportes
          </CardTitle>
          <CardDescription>
            Configure los filtros para generar reportes específicos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Fecha inicio</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate">Fecha fin</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="clientFilter">Cliente</Label>
              <Select
                value={clientId}
                onValueChange={setClientId}
              >
                <SelectTrigger id="clientFilter">
                  <SelectValue placeholder="Todos los clientes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los clientes</SelectItem>
                  {clients.map(client => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sellerFilter">Vendedor</Label>
              <Select
                value={sellerId}
                onValueChange={setSellerId}
              >
                <SelectTrigger id="sellerFilter">
                  <SelectValue placeholder="Todos los vendedores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los vendedores</SelectItem>
                  {sellers.map(seller => (
                    <SelectItem key={seller.id} value={seller.id}>
                      {seller.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="conceptFilter">Concepto</Label>
              <Select
                value={conceptId}
                onValueChange={setConceptId}
              >
                <SelectTrigger id="conceptFilter">
                  <SelectValue placeholder="Todos los conceptos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los conceptos</SelectItem>
                  {concepts.map(concept => (
                    <SelectItem key={concept.id} value={concept.id}>
                      {concept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button onClick={handleResetFilters} variant="outline" className="w-full">
                Restablecer Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resultados</CardTitle>
          <CardDescription>
            Se encontraron {filteredSales.length} ventas | Total: {formatCurrency(totalAmount)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Vendedor</TableHead>
                  <TableHead>Concepto</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.length > 0 ? (
                  filteredSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>{formatDate(sale.date)}</TableCell>
                      <TableCell>{getClientName(sale.clientId)}</TableCell>
                      <TableCell>{getSellerName(sale.sellerId)}</TableCell>
                      <TableCell>{getConceptName(sale.conceptId)}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(sale.amount)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      No se encontraron ventas con los filtros aplicados
                    </TableCell>
                  </TableRow>
                )}
                {filteredSales.length > 0 && (
                  <TableRow className="bg-muted/50">
                    <TableCell colSpan={4} className="text-right font-bold">
                      Total:
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {formatCurrency(totalAmount)}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </Dashboard>
  );
};

export default ReportsPage;

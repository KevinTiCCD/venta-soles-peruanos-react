
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
import { FileText, Filter, CalendarRange } from 'lucide-react';
import { ChartContainer } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

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
  const [month, setMonth] = useState<string>('');
  const [year, setYear] = useState<string>('');

  // Meses en español para el filtro
  const months = [
    { value: '0', label: 'Enero' },
    { value: '1', label: 'Febrero' },
    { value: '2', label: 'Marzo' },
    { value: '3', label: 'Abril' },
    { value: '4', label: 'Mayo' },
    { value: '5', label: 'Junio' },
    { value: '6', label: 'Julio' },
    { value: '7', label: 'Agosto' },
    { value: '8', label: 'Septiembre' },
    { value: '9', label: 'Octubre' },
    { value: '10', label: 'Noviembre' },
    { value: '11', label: 'Diciembre' }
  ];

  // Años para el filtro (5 años atrás y 5 años adelante)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => (currentYear - 5 + i).toString());

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
    
    // Set default month and year
    setMonth(now.getMonth().toString());
    setYear(now.getFullYear().toString());
  }, []);

  useEffect(() => {
    applyFilters();
  }, [startDate, endDate, clientId, sellerId, conceptId, month, year]);

  const applyFilters = () => {
    let filtered = [...sales];
    
    // Si hay mes y año seleccionados, estos tienen prioridad sobre el rango de fechas
    if (month && year) {
      const selectedMonth = parseInt(month, 10);
      const selectedYear = parseInt(year, 10);
      const startOfMonth = new Date(selectedYear, selectedMonth, 1);
      const endOfMonth = new Date(selectedYear, selectedMonth + 1, 0, 23, 59, 59);
      
      filtered = filtered.filter(sale => {
        const saleDate = new Date(sale.date);
        return saleDate >= startOfMonth && saleDate <= endOfMonth;
      });
    } else {
      // Si no hay mes y año, usar el rango de fechas
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
    setMonth('');
    setYear('');
    
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

  // Preparar datos para el gráfico
  const prepareChartData = () => {
    // Agrupar ventas por concepto
    const salesByConceptMap = new Map<string, number>();
    
    filteredSales.forEach(sale => {
      const conceptName = getConceptName(sale.conceptId);
      const currentTotal = salesByConceptMap.get(conceptName) || 0;
      salesByConceptMap.set(conceptName, currentTotal + sale.amount);
    });
    
    // Convertir a array para el gráfico
    return Array.from(salesByConceptMap.entries()).map(([name, amount]) => ({
      name,
      amount,
    }));
  };

  const chartData = prepareChartData();

  return (
    <Dashboard title="Reportes">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filtros de Reportes
          </CardTitle>
          <CardDescription>
            Configure los filtros para generar reportes específicos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="month">Mes</Label>
              <Select
                value={month}
                onValueChange={setMonth}
              >
                <SelectTrigger id="month">
                  <SelectValue placeholder="Seleccione mes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los meses</SelectItem>
                  {months.map(month => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="year">Año</Label>
              <Select
                value={year}
                onValueChange={setYear}
              >
                <SelectTrigger id="year">
                  <SelectValue placeholder="Seleccione año" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los años</SelectItem>
                  {years.map(year => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-4">
            <CalendarRange className="h-5 w-5" />
            <span className="font-medium">O seleccione un rango de fechas:</span>
          </div>

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

      {chartData.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Análisis de Ventas por Concepto</CardTitle>
            <CardDescription>
              Distribución de ventas según concepto para el periodo seleccionado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Bar dataKey="amount" name="Monto (S/)" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

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

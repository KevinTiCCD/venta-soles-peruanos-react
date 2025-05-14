
import { useState, useEffect } from 'react';
import Dashboard from '@/components/Layout/Dashboard';
import { getSales, getClients, getSellers, getConcepts } from '@/utils/storage';
import { Sale } from '@/utils/types';
import { FilterSection } from '@/components/reports/FilterSection';
import { ChartSection } from '@/components/reports/ChartSection';
import { ResultsTable } from '@/components/reports/ResultsTable';

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
      <FilterSection 
        clients={clients}
        sellers={sellers}
        concepts={concepts}
        startDate={startDate}
        endDate={endDate}
        clientId={clientId}
        sellerId={sellerId}
        conceptId={conceptId}
        month={month}
        year={year}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        setClientId={setClientId}
        setSellerId={setSellerId}
        setConceptId={setConceptId}
        setMonth={setMonth}
        setYear={setYear}
        handleResetFilters={handleResetFilters}
      />

      <ChartSection chartData={chartData} />

      <ResultsTable 
        filteredSales={filteredSales}
        totalAmount={totalAmount}
        getClientName={getClientName}
        getSellerName={getSellerName}
        getConceptName={getConceptName}
        formatDate={formatDate}
      />
    </Dashboard>
  );
};

export default ReportsPage;

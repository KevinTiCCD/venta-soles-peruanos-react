
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Filter, CalendarRange } from 'lucide-react';

interface FilterSectionProps {
  clients: { id: string; name: string }[];
  sellers: { id: string; name: string }[];
  concepts: { id: string; name: string }[];
  startDate: string;
  endDate: string;
  clientId: string;
  sellerId: string;
  conceptId: string;
  month: string;
  year: string;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  setClientId: (id: string) => void;
  setSellerId: (id: string) => void;
  setConceptId: (id: string) => void;
  setMonth: (month: string) => void;
  setYear: (year: string) => void;
  handleResetFilters: () => void;
}

export const FilterSection = ({
  clients,
  sellers,
  concepts,
  startDate,
  endDate,
  clientId,
  sellerId,
  conceptId,
  month,
  year,
  setStartDate,
  setEndDate,
  setClientId,
  setSellerId,
  setConceptId,
  setMonth,
  setYear,
  handleResetFilters,
}: FilterSectionProps) => {
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

  return (
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
  );
};

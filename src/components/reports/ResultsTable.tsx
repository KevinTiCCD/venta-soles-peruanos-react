
import { formatCurrency } from '@/utils/printUtils';
import { Sale } from '@/utils/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ResultsTableProps {
  filteredSales: Sale[];
  totalAmount: number;
  getClientName: (id: string) => string;
  getSellerName: (id: string) => string;
  getConceptName: (id: string) => string;
  formatDate: (date: Date) => string;
}

export const ResultsTable = ({ 
  filteredSales, 
  totalAmount, 
  getClientName, 
  getSellerName, 
  getConceptName, 
  formatDate
}: ResultsTableProps) => {
  return (
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
  );
};

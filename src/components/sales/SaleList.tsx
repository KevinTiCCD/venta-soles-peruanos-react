
import { Sale } from '@/utils/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2, Eye, Printer } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { formatCurrency, formatDate } from '@/utils/printUtils';
import { getClientById, getSellerById, getConceptById } from '@/utils/storage';

interface SaleListProps {
  sales: Sale[];
  onDelete: (id: string) => void;
  onViewReceipt: (sale: Sale) => void;
}

const SaleList = ({ sales, onDelete, onViewReceipt }: SaleListProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleDeleteClick = (id: string) => {
    setSaleToDelete(id);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (saleToDelete) {
      onDelete(saleToDelete);
      setIsDeleteDialogOpen(false);
      setSaleToDelete(null);
    }
  };
  
  const filteredSales = sales.filter(sale => {
    const client = getClientById(sale.clientId);
    const seller = getSellerById(sale.sellerId);
    const concept = getConceptById(sale.conceptId);
    
    const searchString = [
      client?.name, 
      seller?.name, 
      concept?.name,
      formatDate(sale.date),
      sale.observation
    ].join(' ').toLowerCase();
    
    return searchString.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Input
            placeholder="Buscar venta..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
          <div className="absolute inset-y-0 left-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Concepto</TableHead>
              <TableHead>Vendedor</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSales.length > 0 ? (
              filteredSales.map((sale) => {
                const client = getClientById(sale.clientId);
                const seller = getSellerById(sale.sellerId);
                const concept = getConceptById(sale.conceptId);
                
                return (
                  <TableRow key={sale.id}>
                    <TableCell>{formatDate(new Date(sale.date))}</TableCell>
                    <TableCell>{client?.name || 'Cliente no encontrado'}</TableCell>
                    <TableCell>{concept?.name || 'Concepto no encontrado'}</TableCell>
                    <TableCell>{seller?.name || 'Vendedor no encontrado'}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(sale.amount)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => onViewReceipt(sale)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Ver</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteClick(sale.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Eliminar</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  No se encontraron ventas
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el registro de venta seleccionado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SaleList;

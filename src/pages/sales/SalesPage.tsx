
import { useState, useEffect } from 'react';
import Dashboard from '@/components/Layout/Dashboard';
import SaleForm from '@/components/sales/SaleForm';
import SaleList from '@/components/sales/SaleList';
import { Sale } from '@/utils/types';
import { getSales, create, remove } from '@/utils/storage';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';
import SaleReceipt from '@/components/sales/SaleReceipt';

const SalesPage = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = () => {
    const loadedSales = getSales();
    // Sort by date descending
    loadedSales.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setSales(loadedSales);
  };

  const handleCreateSale = (sale: Omit<Sale, 'id' | 'createdAt'>) => {
    const newSale = create<Sale>('sale', sale as Sale);
    toast({
      title: 'Venta registrada',
      description: 'La venta ha sido registrada exitosamente',
    });
    loadSales();
    setIsFormOpen(false);
    
    // Show receipt after sale creation
    setSelectedSale(newSale);
    setIsReceiptOpen(true);
  };

  const handleDeleteSale = (id: string) => {
    remove<Sale>('sale', id);
    toast({
      title: 'Venta eliminada',
      description: 'La venta ha sido eliminada correctamente',
    });
    loadSales();
  };

  const handleViewReceipt = (sale: Sale) => {
    setSelectedSale(sale);
    setIsReceiptOpen(true);
  };

  const handleAddNew = () => {
    setIsFormOpen(true);
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
  };

  const handleCloseReceipt = () => {
    setIsReceiptOpen(false);
    setSelectedSale(null);
  };

  return (
    <Dashboard title="Gestión de Ventas">
      <div className="mb-6 flex justify-between items-center">
        <p className="text-muted-foreground">
          Registra y administra tus ventas
        </p>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Venta
        </Button>
      </div>

      {isFormOpen ? (
        <SaleForm
          onSubmit={handleCreateSale}
          onCancel={handleCancelForm}
        />
      ) : isReceiptOpen && selectedSale ? (
        <SaleReceipt
          sale={selectedSale}
          onClose={handleCloseReceipt}
        />
      ) : (
        <SaleList
          sales={sales}
          onDelete={handleDeleteSale}
          onViewReceipt={handleViewReceipt}
        />
      )}
    </Dashboard>
  );
};

export default SalesPage;

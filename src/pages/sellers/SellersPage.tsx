
import { useState, useEffect } from 'react';
import Dashboard from '@/components/Layout/Dashboard';
import SellerForm from '@/components/sellers/SellerForm';
import SellerList from '@/components/sellers/SellerList';
import { Seller } from '@/utils/types';
import { getSellers, create, update, remove } from '@/utils/storage';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

const SellersPage = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentSeller, setCurrentSeller] = useState<Seller | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadSellers();
  }, []);

  const loadSellers = () => {
    const loadedSellers = getSellers();
    setSellers(loadedSellers);
  };

  const handleCreateSeller = (seller: Omit<Seller, 'id' | 'createdAt'>) => {
    create<Seller>('seller', seller as Seller);
    toast({
      title: 'Vendedor creado',
      description: 'El vendedor ha sido creado exitosamente',
    });
    loadSellers();
    setIsFormOpen(false);
  };

  const handleUpdateSeller = (seller: Seller) => {
    update<Seller>('seller', seller);
    toast({
      title: 'Vendedor actualizado',
      description: 'Los datos del vendedor han sido actualizados',
    });
    loadSellers();
    setIsFormOpen(false);
    setCurrentSeller(null);
  };

  const handleDeleteSeller = (id: string) => {
    remove<Seller>('seller', id);
    toast({
      title: 'Vendedor eliminado',
      description: 'El vendedor ha sido eliminado correctamente',
    });
    loadSellers();
  };

  const handleEditSeller = (seller: Seller) => {
    setCurrentSeller(seller);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setCurrentSeller(null);
    setIsFormOpen(true);
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setCurrentSeller(null);
  };

  return (
    <Dashboard title="Gestión de Vendedores">
      <div className="mb-6 flex justify-between items-center">
        <p className="text-muted-foreground">
          Administra la información de tus vendedores
        </p>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Vendedor
        </Button>
      </div>

      {isFormOpen ? (
        <SellerForm
          seller={currentSeller}
          onSubmit={currentSeller ? handleUpdateSeller : handleCreateSeller}
          onCancel={handleCancelForm}
        />
      ) : (
        <SellerList
          sellers={sellers}
          onEdit={handleEditSeller}
          onDelete={handleDeleteSeller}
        />
      )}
    </Dashboard>
  );
};

export default SellersPage;

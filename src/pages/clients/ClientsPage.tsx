
import { useState, useEffect } from 'react';
import Dashboard from '@/components/Layout/Dashboard';
import ClientForm from '@/components/clients/ClientForm';
import ClientList from '@/components/clients/ClientList';
import { Client } from '@/utils/types';
import { getClients, create, update, remove } from '@/utils/storage';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

const ClientsPage = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = () => {
    const loadedClients = getClients();
    setClients(loadedClients);
  };

  const handleCreateClient = (client: Omit<Client, 'id' | 'createdAt'>) => {
    create<Client>('client', client as Client);
    toast({
      title: 'Cliente creado',
      description: 'El cliente ha sido creado exitosamente',
    });
    loadClients();
    setIsFormOpen(false);
  };

  const handleUpdateClient = (client: Client) => {
    update<Client>('client', client);
    toast({
      title: 'Cliente actualizado',
      description: 'Los datos del cliente han sido actualizados',
    });
    loadClients();
    setIsFormOpen(false);
    setCurrentClient(null);
  };

  const handleDeleteClient = (id: string) => {
    remove<Client>('client', id);
    toast({
      title: 'Cliente eliminado',
      description: 'El cliente ha sido eliminado correctamente',
    });
    loadClients();
  };

  const handleEditClient = (client: Client) => {
    setCurrentClient(client);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setCurrentClient(null);
    setIsFormOpen(true);
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setCurrentClient(null);
  };

  return (
    <Dashboard title="Gestión de Clientes">
      <div className="mb-6 flex justify-between items-center">
        <p className="text-muted-foreground">
          Administra la información de tus clientes
        </p>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Cliente
        </Button>
      </div>

      {isFormOpen ? (
        <ClientForm
          client={currentClient}
          onSubmit={currentClient ? handleUpdateClient : handleCreateClient}
          onCancel={handleCancelForm}
        />
      ) : (
        <ClientList
          clients={clients}
          onEdit={handleEditClient}
          onDelete={handleDeleteClient}
        />
      )}
    </Dashboard>
  );
};

export default ClientsPage;

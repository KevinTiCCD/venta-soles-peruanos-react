
import { useState, useEffect } from 'react';
import Dashboard from '@/components/Layout/Dashboard';
import CredentialForm from '@/components/credentials/CredentialForm';
import CredentialList from '@/components/credentials/CredentialList';
import { Credential } from '@/utils/types';
import { getCredentials, create, update, remove } from '@/utils/storage';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

const CredentialsPage = () => {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentCredential, setCurrentCredential] = useState<Credential | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadCredentials();
  }, []);

  const loadCredentials = () => {
    const loadedCredentials = getCredentials();
    setCredentials(loadedCredentials);
  };

  const handleCreateCredential = (credential: Omit<Credential, 'id' | 'createdAt'>) => {
    create<Credential>('credential', credential as Credential);
    toast({
      title: 'Credencial creada',
      description: 'La credencial ha sido creada exitosamente',
    });
    loadCredentials();
    setIsFormOpen(false);
  };

  const handleUpdateCredential = (credential: Credential) => {
    update<Credential>('credential', credential);
    toast({
      title: 'Credencial actualizada',
      description: 'Los datos de la credencial han sido actualizados',
    });
    loadCredentials();
    setIsFormOpen(false);
    setCurrentCredential(null);
  };

  const handleDeleteCredential = (id: string) => {
    remove<Credential>('credential', id);
    toast({
      title: 'Credencial eliminada',
      description: 'La credencial ha sido eliminada correctamente',
    });
    loadCredentials();
  };

  const handleEditCredential = (credential: Credential) => {
    setCurrentCredential(credential);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setCurrentCredential(null);
    setIsFormOpen(true);
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setCurrentCredential(null);
  };

  return (
    <Dashboard title="Gestión de Credenciales">
      <div className="mb-6 flex justify-between items-center">
        <p className="text-muted-foreground">
          Administra las credenciales del sistema
        </p>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Credencial
        </Button>
      </div>

      {isFormOpen ? (
        <CredentialForm
          credential={currentCredential}
          onSubmit={currentCredential ? handleUpdateCredential : handleCreateCredential}
          onCancel={handleCancelForm}
        />
      ) : (
        <CredentialList
          credentials={credentials}
          onEdit={handleEditCredential}
          onDelete={handleDeleteCredential}
        />
      )}
    </Dashboard>
  );
};

export default CredentialsPage;

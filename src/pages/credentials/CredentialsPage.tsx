
import { useState, useEffect } from 'react';
import Dashboard from '@/components/Layout/Dashboard';
import CredentialForm from '@/components/credentials/CredentialForm';
import CredentialList from '@/components/credentials/CredentialList';
import { Credential } from '@/utils/types';
import { getCredentials, create, update, remove } from '@/utils/storage';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Plus, LogIn } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const CredentialsPage = () => {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentCredential, setCurrentCredential] = useState<Credential | null>(null);
  const { toast } = useToast();
  
  // Estados para el login
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulación básica de autenticación
    const credential = credentials.find(
      (c) => c.name.toLowerCase() === username.toLowerCase()
    );
    
    if (credential) {
      toast({
        title: 'Acceso concedido',
        description: `Bienvenido ${credential.name}`,
      });
      setUsername('');
      setPassword('');
      setShowLogin(false);
    } else {
      toast({
        title: 'Acceso denegado',
        description: 'Credenciales incorrectas',
        variant: 'destructive'
      });
    }
  };

  return (
    <Dashboard title="Gestión de Credenciales">
      <div className="mb-6 flex justify-between items-center">
        <p className="text-muted-foreground">
          Administra las credenciales de acceso al sistema
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowLogin(!showLogin)}>
            <LogIn className="mr-2 h-4 w-4" />
            {showLogin ? 'Cancelar Login' : 'Acceder'}
          </Button>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Credencial
          </Button>
        </div>
      </div>

      {showLogin && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">Usuario</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ingrese su nombre de usuario"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ingrese su contraseña"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  <LogIn className="mr-2 h-4 w-4" /> Ingresar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isFormOpen ? (
        <CredentialForm
          credential={currentCredential}
          onSubmit={currentCredential ? handleUpdateCredential : handleCreateCredential}
          onCancel={handleCancelForm}
        />
      ) : (
        !showLogin && (
          <CredentialList
            credentials={credentials}
            onEdit={handleEditCredential}
            onDelete={handleDeleteCredential}
          />
        )
      )}
    </Dashboard>
  );
};

export default CredentialsPage;


import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Credential } from '@/utils/types';
import { getCredentials } from '@/utils/storage';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  user: Credential | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<Credential | null>(null);
  const { toast } = useToast();

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse stored user data');
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const credentials = getCredentials();
    
    // Find the credential with matching username
    const credential = credentials.find(
      (c) => c.name.toLowerCase() === username.toLowerCase()
    );
    
    // Simulate password check (in a real app, you'd use hashing)
    if (credential) {
      // In a real app, this would use proper password hashing/verification
      setUser(credential);
      setIsAuthenticated(true);
      
      // Store user in localStorage (excluding password)
      const { password: _, ...userToStore } = credential;
      localStorage.setItem('currentUser', JSON.stringify(userToStore));
      
      toast({
        title: 'Acceso concedido',
        description: `Bienvenido ${credential.name}`,
      });
      
      return true;
    } else {
      toast({
        title: 'Acceso denegado',
        description: 'Credenciales incorrectas',
        variant: 'destructive'
      });
      
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
    toast({
      title: 'Sesión finalizada',
      description: 'Has cerrado sesión correctamente',
    });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

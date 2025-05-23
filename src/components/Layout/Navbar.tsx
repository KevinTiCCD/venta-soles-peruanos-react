
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { name: 'Dashboard', path: '/' },
  { name: 'Clientes', path: '/clientes' },
  { name: 'Vendedores', path: '/vendedores' },
  { name: 'Conceptos', path: '/conceptos' },
  { name: 'Credenciales', path: '/credenciales' },
  { name: 'Ventas', path: '/ventas' },
  { name: 'Reportes', path: '/reportes' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const { user, logout } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 text-2xl font-bold text-primary">
              Julio
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium",
                  location.pathname === item.path
                    ? "bg-primary text-primary-foreground"
                    : "text-gray-600 hover:bg-muted hover:text-gray-900"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
          
          {/* User info and logout */}
          <div className="flex items-center">
            <div className="hidden md:flex items-center mr-4 text-sm text-gray-600">
              <User className="h-4 w-4 mr-1" />
              <span>{user?.name}</span>
            </div>
            <Button variant="outline" size="sm" onClick={logout} className="flex items-center">
              <LogOut className="h-4 w-4 mr-1" />
              <span>Salir</span>
            </Button>
            
            {/* Mobile menu button */}
            <div className="flex items-center ml-4 md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMenu}
                aria-label="Menu principal"
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobile && isOpen && (
        <div className="md:hidden">
          <div className="flex flex-col px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium",
                  location.pathname === item.path
                    ? "bg-primary text-primary-foreground"
                    : "text-gray-600 hover:bg-muted hover:text-gray-900"
                )}
                onClick={closeMenu}
              >
                {item.name}
              </Link>
            ))}
            <div className="px-3 py-2 flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600">
                <User className="h-4 w-4 mr-1" />
                <span>{user?.name}</span>
              </div>
              <Button variant="outline" size="sm" onClick={logout} className="flex items-center">
                <LogOut className="h-4 w-4 mr-1" />
                <span>Salir</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

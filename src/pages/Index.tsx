
import { useEffect, useState } from 'react';
import Dashboard from '@/components/Layout/Dashboard';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { getClients, getSellers, getConcepts, getSales } from '@/utils/storage';
import { formatCurrency } from '@/utils/printUtils';
import { Users, User, File, Receipt, FileText } from 'lucide-react';

const Index = () => {
  const [stats, setStats] = useState({
    clientCount: 0,
    sellerCount: 0,
    conceptCount: 0,
    saleCount: 0,
    totalSales: 0,
  });

  useEffect(() => {
    const clients = getClients();
    const sellers = getSellers();
    const concepts = getConcepts();
    const sales = getSales();
    
    const totalAmount = sales.reduce((sum, sale) => sum + sale.amount, 0);
    
    setStats({
      clientCount: clients.length,
      sellerCount: sellers.length,
      conceptCount: concepts.length,
      saleCount: sales.length,
      totalSales: totalAmount,
    });
  }, []);

  return (
    <Dashboard title="Panel Principal">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Users className="mr-2 h-5 w-5 text-primary" />
              Clientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.clientCount}</p>
          </CardContent>
          <CardFooter>
            <Link to="/clientes">
              <Button variant="secondary" size="sm">Ver todos</Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <User className="mr-2 h-5 w-5 text-primary" />
              Vendedores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.sellerCount}</p>
          </CardContent>
          <CardFooter>
            <Link to="/vendedores">
              <Button variant="secondary" size="sm">Ver todos</Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <File className="mr-2 h-5 w-5 text-primary" />
              Conceptos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.conceptCount}</p>
          </CardContent>
          <CardFooter>
            <Link to="/conceptos">
              <Button variant="secondary" size="sm">Ver todos</Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Receipt className="mr-2 h-5 w-5 text-primary" />
              Ventas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.saleCount}</p>
            <p className="text-muted-foreground">{formatCurrency(stats.totalSales)}</p>
          </CardContent>
          <CardFooter>
            <Link to="/ventas">
              <Button variant="secondary" size="sm">Ver todas</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
      
      <div className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Acciones Rápidas
            </CardTitle>
            <CardDescription>
              Accesos directos a las funciones principales
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/ventas">
              <Button variant="secondary" className="w-full">Nueva Venta</Button>
            </Link>
            <Link to="/clientes">
              <Button variant="outline" className="w-full">Gestionar Clientes</Button>
            </Link>
            <Link to="/reportes">
              <Button variant="outline" className="w-full">Ver Reportes</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </Dashboard>
  );
};

export default Index;

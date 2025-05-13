
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { initializeData } from "./utils/storage";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ClientsPage from "./pages/clients/ClientsPage";
import SellersPage from "./pages/sellers/SellersPage";
import ConceptsPage from "./pages/concepts/ConceptsPage";
import CredentialsPage from "./pages/credentials/CredentialsPage";
import SalesPage from "./pages/sales/SalesPage";
import ReportsPage from "./pages/reports/ReportsPage";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Initialize sample data if needed
    initializeData();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/clientes" element={<ClientsPage />} />
            <Route path="/vendedores" element={<SellersPage />} />
            <Route path="/conceptos" element={<ConceptsPage />} />
            <Route path="/credenciales" element={<CredentialsPage />} />
            <Route path="/ventas" element={<SalesPage />} />
            <Route path="/reportes" element={<ReportsPage />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

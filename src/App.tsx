
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { FielProvider } from "@/contexts/FielContext";

// Pages
import Dashboard from "./pages/Dashboard";
import ConfiguracionFiel from "./pages/ConfiguracionFiel";
import Solicitudes from "./pages/Solicitudes";
import VerificarEstado from "./pages/VerificarEstado";
import DescargarPaquetes from "./pages/DescargarPaquetes";
import LeerPaquetes from "./pages/LeerPaquetes";
import Historial from "./pages/Historial";
import Archivadas from "./pages/Archivadas";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <FielProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/configuracion" element={<ConfiguracionFiel />} />
              <Route path="/solicitudes" element={<Solicitudes />} />
              <Route path="/verificar" element={<VerificarEstado />} />
              <Route path="/descargar" element={<DescargarPaquetes />} />
              <Route path="/leer" element={<LeerPaquetes />} />
              <Route path="/historial" element={<Historial />} />
              <Route path="/archivadas" element={<Archivadas />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </FielProvider>
  </QueryClientProvider>
);

export default App;

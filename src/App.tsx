
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
              <Route path="/descargar" element={<div className="p-8 text-center">
                <h1 className="text-2xl font-bold">⬇️ Descargar Paquetes</h1>
                <p className="text-gray-600 mt-2">Próximamente...</p>
              </div>} />
              <Route path="/leer" element={<div className="p-8 text-center">
                <h1 className="text-2xl font-bold">📄 Leer Paquetes</h1>
                <p className="text-gray-600 mt-2">Próximamente...</p>
              </div>} />
              <Route path="/historial" element={<div className="p-8 text-center">
                <h1 className="text-2xl font-bold">📊 Historial</h1>
                <p className="text-gray-600 mt-2">Próximamente...</p>
              </div>} />
              <Route path="/archivadas" element={<div className="p-8 text-center">
                <h1 className="text-2xl font-bold">🗃️ Archivadas</h1>
                <p className="text-gray-600 mt-2">Próximamente...</p>
              </div>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </FielProvider>
  </QueryClientProvider>
);

export default App;

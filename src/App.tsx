import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Sidebar from "./pages/sidebar/sidebar";
import { ThemeProvider } from "./components/them-provider";
import Produtos from "./pages/alertas";
import Alertas from "./pages/alertas";
import Produtoss from "./pages/produtos";
import Contagem from "./pages/contagem";
import { SocketProvider } from "./api/socketContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <Sidebar>
            <SocketProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/alertas" element={<Alertas />} />
                <Route path="/produtos" element={<Produtoss />} />
                <Route path="/contagem" element={<Contagem />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </SocketProvider>
          </Sidebar>
        </ThemeProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

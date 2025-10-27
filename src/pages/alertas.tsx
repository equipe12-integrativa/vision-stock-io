import { useEffect, useState } from "react";
import { Package, Search, Filter, X, AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "@/api/api";
import { useSocket } from "@/api/socketContext";
import { StockAlert } from "@/components/StockAlert";

interface Product {
  id: number;
  nome: string;
  unidade: string;
  estoqueatual: number;
  previsao: { semana1: number; semana2: number; semana3: number; semana4: number };
  estoqueZerandoEm: string;
  alerta: string;
}

const Alertas = () => {
  const socket = useSocket();
  const [products, setProducts] = useState<Product[]>([]);
  const [alertData, setAlertData] = useState<{ id: number; nome: string; estoqueAtual: number } | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [unidadeFilter, setUnidadeFilter] = useState("todas");
  const [sortBy, setSortBy] = useState("estoque-desc");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // --- BUSCA DADOS DA API ---
  const fetchProducts = async () => {
    try {
      const response = await api.get("/produtos");
      const data = response.data.data;

      const productsParsed: Product[] = data.map((item: any) => ({
        id: item.id,
        nome: item.nome,
        unidade: item.unidade,
        estoqueatual: Number(item.estoqueatual),
        previsao: {
          semana1: Number(item.semana1 ?? item.previsao?.semana1),
          semana2: Number(item.semana2 ?? item.previsao?.semana2),
          semana3: Number(item.semana3 ?? item.previsao?.semana3),
          semana4: Number(item.semana4 ?? item.previsao?.semana4),
        },
        estoqueZerandoEm: item.estoqueZerandoEm,
        alerta: item.alerta,
      }));

      setProducts(productsParsed);
    } catch (err) {
      console.error("Erro ao consumir API:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // --- ESCUTA O SOCKET ---
  useEffect(() => {
    socket.on("Produto identificado", (data: any) => {
      setAlertData({
        id: data.id,
        nome: data.nome,
        estoqueAtual: data.estoqueatual,
      });
    });

    return () => {
      socket.off("Produto identificado");
    };
  }, [socket]);

  // --- FILTROS E ORDENAÇÃO ---
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.id.toString().includes(searchQuery);

      const matchesStatus =
        statusFilter === "todos" ||
        (statusFilter === "ruptura" && product.alerta.includes("Ruptura iminente")) ||
        (statusFilter === "critico" && product.alerta.includes("crítico")) ||
        (statusFilter === "estavel" && product.alerta.includes("estável"));

      const matchesUnidade = unidadeFilter === "todas" || product.unidade === unidadeFilter;

      return matchesSearch && matchesStatus && matchesUnidade;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "estoque-desc":
          return b.estoqueatual - a.estoqueatual;
        case "estoque-asc":
          return a.estoqueatual - b.estoqueatual;
        case "nome-asc":
          return a.nome.localeCompare(b.nome);
        case "nome-desc":
          return b.nome.localeCompare(a.nome);
        default:
          return 0;
      }
    });

  // --- ÍCONES E CORES DE ALERTA ---
  const getAlertIcon = (alerta: string) => {
    if (alerta.includes("Ruptura iminente")) return <AlertTriangle className="h-5 w-5 text-red-500" />;
    if (alerta.includes("crítico")) return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    return <CheckCircle className="h-5 w-5 text-green-500" />;
  };

  const getAlertColor = (alerta: string) => {
    if (alerta.includes("Ruptura iminente")) return "border-red-600";
    if (alerta.includes("crítico")) return "border-yellow-500";
    return "border-green-500";
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {alertData && (
        <StockAlert
          id={alertData.id}
          nome={alertData.nome}
          estoqueAtual={alertData.estoqueAtual}
          onClose={() => setAlertData(null)}
          onUpdate={fetchProducts}
        />
      )}

      <header className="border-b shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Alertas e Previsões</h1>
                <p className="text-sm mt-1">{filteredProducts.length} produtos encontrados</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="border-b top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por nome ou código..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="ruptura">⚠️ Ruptura iminente</SelectItem>
                <SelectItem value="critico">🟡 Estoque crítico</SelectItem>
                <SelectItem value="estavel">✅ Estoque estável</SelectItem>
              </SelectContent>
            </Select>

            <Select value={unidadeFilter} onValueChange={setUnidadeFilter}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Unidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas unidades</SelectItem>
                <SelectItem value="M">Metro (M)</SelectItem>
                <SelectItem value="PC">Peça (PC)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-[200px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="estoque-desc">Maior estoque</SelectItem>
                <SelectItem value="estoque-asc">Menor estoque</SelectItem>
                <SelectItem value="nome-asc">Nome A-Z</SelectItem>
                <SelectItem value="nome-desc">Nome Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className={`bg-card border rounded-lg p-5 cursor-pointer hover:shadow-md transition-all ${getAlertColor(product.alerta)}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="text-xs font-semibold mb-1 text-foreground/70">ID: {product.id}</div>
                  <h3 className="font-semibold text-sm leading-tight text-foreground">{product.nome}</h3>
                </div>
                {getAlertIcon(product.alerta)}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-foreground/70">Estoque Atual:</span>
                  <span className="font-bold text-foreground">
                    {product.estoqueatual.toLocaleString("pt-BR")} {product.unidade}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-foreground/70">Zerando em:</span>
                  <span className="text-xs font-medium text-foreground">
                    {product.estoqueZerandoEm ? new Date(product.estoqueZerandoEm).toLocaleDateString("pt-BR") : "-"}
                  </span>
                </div>

                <div className="pt-2 border-t border-border">
                  <div className="text-xs font-medium mb-1 text-foreground/70">Previsão Semanal:</div>
                  <div className="grid grid-cols-4 gap-1">
                    {Object.entries(product.previsao).map(([week, value], idx) => (
                      <div key={week} className="text-center">
                        <div className="text-xs text-foreground/70">S{idx + 1}</div>
                        <div className="text-xs font-semibold text-foreground">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-xs font-medium">{product.alerta}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum produto encontrado</h3>
            <p>Tente ajustar os filtros ou termo de busca</p>
          </div>
        )}
      </main>

      {isSearchModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">Busca Avançada</h2>
              <button onClick={() => setIsSearchModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <Input
                type="text"
                placeholder="Digite o nome ou código do produto..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-4"
                autoFocus
              />

              <div className="max-h-96 overflow-y-auto">
                {filteredProducts.slice(0, 10).map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      setSelectedProduct(product);
                      setIsSearchModalOpen(false);
                    }}
                    className="p-4 hover:bg-gray-50 cursor-pointer border-b last:border-0"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold">{product.nome}</div>
                        <div className="text-xs">ID: {product.id}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold">
                          {product.estoqueatual.toLocaleString("pt-BR")} {product.unidade}
                        </div>
                        <div className="text-xs">{product.alerta}</div>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredProducts.length === 0 && (
                  <div className="text-center py-6 text-sm text-gray-500">Nenhum resultado encontrado.</div>
                )}
              </div>
            </div>

            <div className="p-6 border-t flex justify-end">
              <Button variant="outline" onClick={() => setIsSearchModalOpen(false)}>
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alertas;

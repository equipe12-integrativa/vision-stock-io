import { useEffect, useState } from "react";
import { Package, Search, Filter, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductTable, Product } from "@/components/ProductTable";
import api from "@/api/api";

const Produtoss = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [unidadeFilter, setUnidadeFilter] = useState("todas");
  const [sortBy, setSortBy] = useState("estoque-desc");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<"semana1" | "semana2" | "semana3" | "semana4">("semana1");

  // --- Carregar produtos da API ---
  useEffect(() => {
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

    fetchProducts();
  }, []);

  // --- Filtragem e ordenação ---
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 py-6 flex items-center gap-3">
          <Package className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Estoque e Produtos</h1>
            <p className="text-sm mt-1">{filteredProducts.length} produtos encontrados</p>
          </div>
        </div>
      </header>

      {/* Filtros */}
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

      {/* Tabela */}
      <div className="container mx-auto px-4 sm:px-6 py-6">
        <ProductTable products={filteredProducts} selectedWeek={selectedWeek} />
      </div>
    </div>
  );
};

export default Produtoss;

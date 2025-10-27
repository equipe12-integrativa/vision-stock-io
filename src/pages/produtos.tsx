import { useEffect, useState } from "react";
import { Package, Search, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ProductTable, Product } from "@/components/ProductTable";
import api from "@/api/api";
import { useSocket } from "@/api/socketContext";
import { StockAlert } from "@/components/StockAlert";

// ***************************************************************
// NOTA IMPORTANTE:
// Você deve garantir que a interface 'Product' inclua as propriedades 'dataCompra' e 'preco'.
// Exemplo:
// export interface Product {
//   id: number;
//   nome: string;
//   unidade: string;
//   estoqueatual: number;
//   previsao: {
//     semana1: number;
//     semana2: number;
//     semana3: number;
//     semana4: number;
//   };
//   estoquezerandoem: string | null;
//   alerta: string;
//   dataCompra: string | null;
//   preco: number; // <-- NOVO CAMPO
// }
// ***************************************************************

const Produtoss = () => {
  const socket = useSocket();

  const [alertData, setAlertData] = useState<{
    id: number;
    nome: string;
    estoqueAtual: number;
  } | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [unidadeFilter, setUnidadeFilter] = useState("todas");
  const [sortBy, setSortBy] = useState("estoque-desc");
  const [selectedWeek, setSelectedWeek] = useState<"semana1" | "semana2" | "semana3" | "semana4">("semana1");

  // função reutilizável para buscar produtos
  const fetchProducts = async () => {
    try {
      const response = await api.get("/produtos");
      const data = response.data.data;

      const productsParsed: Product[] = data.map((item: any) => {
        // --- LÓGICA PARA CALCULAR A dataCompra ---
        const estoqueZerandoDate = item.estoquezerandoem 
          ? new Date(item.estoquezerandoem) 
          : null; 

        let dataCompra: string | null = null;
        if (estoqueZerandoDate && !isNaN(estoqueZerandoDate.getTime())) {
          estoqueZerandoDate.setDate(estoqueZerandoDate.getDate() - 20);
          dataCompra = estoqueZerandoDate.toLocaleDateString('pt-BR');
        }

        // --- LÓGICA PARA GERAR PREÇO ---
        let preco = 0;
        const nomeUpper = item.nome.toUpperCase();
        if (nomeUpper.includes("TAMPA")) preco = Number((Math.random() * 15 + 5).toFixed(2));
        else if (nomeUpper.includes("COMBUSTÍVEL")) preco = Number((Math.random() * 80 + 20).toFixed(2));
        else if (nomeUpper.includes("UN")) preco = Number((Math.random() * 9 + 1).toFixed(2));
        else preco = Number((Math.random() * 40 + 10).toFixed(2));

        return {
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
          estoquezerandoem: item.estoquezerandoem,
          alerta: item.alerta,
          dataCompra: dataCompra,
          preco: preco,
        };
      });

      setProducts(productsParsed);
    } catch (err) {
      console.error("Erro ao consumir API:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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
        <div className="container mx-auto px-4 sm:px-6 py-6 flex items-center gap-3">
          <Package className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Estoque e Produtos</h1>
            <p className="text-sm mt-1">{filteredProducts.length} produtos encontrados</p>
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

      <div className="container mx-auto px-4 sm:px-6 py-6">
        <ProductTable products={filteredProducts} selectedWeek={selectedWeek} />
      </div>
    </div>
  );
};

export default Produtoss;

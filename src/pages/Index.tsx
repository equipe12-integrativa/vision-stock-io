 import { useEffect, useState } from "react";
import { KPICard } from "@/components/KPICard";
import { ProductTable, Product } from "@/components/ProductTable";
import { SalesChart } from "@/components/SalesChart";
import {
  TrendingDown,
  RotateCcw,
  DollarSign,
  Package,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import api from "@/api/api";

// --- Funções auxiliares ---
const calculateChartData = (products: Product[]) => {
  const weeks = ["semana1", "semana2", "semana3", "semana4"] as const;

  const salesByWeek: { [key: string]: number } = weeks.reduce((acc, week) => {
    acc[week] = products.reduce((sum, product) => sum + product[week], 0); // <- Corrigido aqui
    return acc;
  }, {} as { [key: string]: number });

  let totalStock = products.reduce((sum, product) => sum + product.estoqueatual, 0);

  return weeks.map((week, index) => {
    const sales = salesByWeek[week];
    let stockAtStartOfWeek = totalStock;
    for (let i = 0; i < index; i++) {
      const prevWeek = weeks[i];
      stockAtStartOfWeek -= salesByWeek[prevWeek];
    }
    return {
      semana: `Semana ${index + 1}`,
      vendas: Math.round(sales),
      estoque: Math.round(stockAtStartOfWeek),
    };
  });
};

const calculateChartDataByProduct = (product: Product) => {
  const weeks = ["semana1", "semana2", "semana3", "semana4"] as const;
  let stock = product.estoqueatual;

  return weeks.map((week, index) => {
    const vendas = product[week]; // <- Corrigido aqui
    const dataPoint = {
      semana: `Semana ${index + 1}`,
      vendas,
      estoque: stock,
    };
    stock -= vendas;
    return dataPoint;
  });
};

const calculateStatusSummary = (products: Product[]) => {
  const summary = { ruptura: 0, critico: 0, estavel: 0 };
  products.forEach((p) => {
    if (p.alerta.includes("Ruptura")) summary.ruptura++;
    else if (p.alerta.includes("crítico")) summary.critico++;
    else if (p.alerta.includes("estável")) summary.estavel++;
  });
  return [
    { name: "Ruptura", value: summary.ruptura },
    { name: "Crítico", value: summary.critico },
    { name: "Estável", value: summary.estavel },
  ];
};

const COLORS = ["#f87171", "#facc15", "#4ade80"]; // vermelho, amarelo, verde

// --- Componente ---
const Index = () => {
  const [produtosMock, setProdutos] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // --- Carrega produtos da API ---
  useEffect(() => {
    api
      .get("/produtos")
      .then((response) => {
        console.log("Resposta da API:", response.data.data); // <- Aqui você vê os dados no console
        setProdutos(response.data.data);
      })
      .catch(() => console.error("Erro ao consumir API"));
  }, []);

  // --- Define produto selecionado quando produtos forem carregados ---
  useEffect(() => {
    if (produtosMock.length > 0 && !selectedProductId) {
      setSelectedProductId(produtosMock[0].id.toString());
    }
  }, [produtosMock, selectedProductId]);

  const selectedProduct = produtosMock.find(p => p.id.toString() === selectedProductId);
  const chartData = selectedProduct ? calculateChartDataByProduct(selectedProduct) : [];
  const estoqueTotalData = produtosMock.length > 0 ? calculateChartData(produtosMock) : [];
  const statusSummary = produtosMock.length > 0 ? calculateStatusSummary(produtosMock) : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-2">
                <Package className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                <span className="leading-tight">Gestão Inteligente de Estoques</span>
              </h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                Dashboard de previsão e alertas automatizados
              </p>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <Select value={selectedProductId || ""} onValueChange={setSelectedProductId}>
                <SelectTrigger className="w-full sm:w-[220px] bg-background">
                  <SelectValue placeholder="Selecione o produto" />
                </SelectTrigger>
                <SelectContent>
                  {produtosMock.map(product => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <KPICard title="Taxa de Ruptura" value="8.5%" subtitle="↓ 2.3% vs. mês anterior" icon={TrendingDown} variant="danger" />
          <KPICard title="Giro de Estoque" value="4.2x" subtitle="↑ 0.8x vs. mês anterior" icon={RotateCcw} variant="success" />
          <KPICard title="Custo de Ruptura" value="R$ 12.4k" subtitle="Estimativa mensal" icon={DollarSign} variant="warning" />
        </div>

        {/* Gráfico do produto selecionado */}
        {selectedProduct && (
          <div className="mb-8">
            <SalesChart data={chartData} />
          </div>
        )}

        {/* Estoque total agregado */}
        {estoqueTotalData.length > 0 && (
          <div className="mb-8 bg-card rounded-2xl p-4 shadow">
            <h2 className="text-lg font-semibold mb-4">Estoque Total x Vendas (Todas as categorias)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={estoqueTotalData}>
                <XAxis dataKey="semana" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="estoque" fill="#60a5fa" name="Estoque Total" />
                <Bar dataKey="vendas" fill="#f97316" name="Vendas Simuladas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Distribuição de status */}
        {statusSummary.length > 0 && (
          <div className="bg-card rounded-2xl p-4 shadow">
            <h2 className="text-lg font-semibold mb-4">Distribuição de Status de Estoque</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusSummary}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name} (${value})`}
                >
                  {statusSummary.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;

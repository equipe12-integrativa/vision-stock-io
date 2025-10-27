import { useEffect, useState } from "react";
import { KPICard } from "@/components/KPICard";
import { Product } from "@/components/ProductTable";
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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import api from "@/api/api";

// ------------------------- Funções auxiliares -------------------------
const calculateChartDataByProduct = (product: Product) => {
  const weeks = ["semana1", "semana2", "semana3", "semana4"] as const;
  let stock = product.estoqueatual;
  return weeks.map((week, index) => {
    const vendas = product[week];
    const dataPoint = {
      semana: `Semana ${index + 1}`,
      vendas,
      estoque: stock,
    };
    stock -= vendas;
    return dataPoint;
  });
};

const calculateChartData = (products: Product[]) => {
  const weeks = ["semana1", "semana2", "semana3", "semana4"] as const;
  const salesByWeek: { [key: string]: number } = weeks.reduce((acc, week) => {
    acc[week] = products.reduce((sum, product) => sum + product[week], 0);
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

// ------------------------- KPI por produto -------------------------
const calculateKpisByProduct = (product: Product | undefined) => {
  if (!product) return { taxaRuptura: 0, giroEstoque: 0, custoRuptura: 0 };

  // Taxa de ruptura
  let taxaRuptura = 0;
  if (product.alerta.includes("Ruptura")) taxaRuptura = 100;
  else if (product.alerta.includes("crítico")) taxaRuptura = 50;
  else taxaRuptura = 0;

  // Giro de estoque = total vendido / estoque atual
  const vendasTotais = product.semana1 + product.semana2 + product.semana3 + product.semana4;
  const giroEstoque = product.estoqueatual > 0 ? vendasTotais / product.estoqueatual : 0;

  // Custo de ruptura estimado = estoque atual * custo unitário perdido
  const custoUnitarioEstimado = 20; // R$ 20 por unidade (ajuste conforme realidade)
  const custoRuptura = product.alerta.includes("Ruptura")
    ? product.estoqueatual * custoUnitarioEstimado
    : 0;

  return { taxaRuptura, giroEstoque, custoRuptura };
};

// ------------------------- Componente principal -------------------------
const Index = () => {
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/produtos")
      .then((response) => {
        const data = response.data.data;
        setProdutos(data);
      })
      .catch(() => console.error("Erro ao consumir API"));
  }, []);

  useEffect(() => {
    if (produtos.length > 0 && !selectedProductId) {
      setSelectedProductId(produtos[0].id.toString());
    }
  }, [produtos, selectedProductId]);

  const selectedProduct = produtos.find((p) => p.id.toString() === selectedProductId);
  const chartData = selectedProduct ? calculateChartDataByProduct(selectedProduct) : [];
  const estoqueTotalData = produtos.length > 0 ? calculateChartData(produtos) : [];
  const statusSummary = produtos.length > 0 ? calculateStatusSummary(produtos) : [];

  // KPIs por produto selecionado
  const { taxaRuptura, giroEstoque, custoRuptura } = calculateKpisByProduct(selectedProduct);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-2">
                <Package className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                <span>Gestão Inteligente de Estoques</span>
              </h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                Dashboard de previsão e alertas automatizados
              </p>
            </div>
            <Select value={selectedProductId || ""} onValueChange={setSelectedProductId}>
              <SelectTrigger className="w-full sm:w-[220px] bg-background">
                <SelectValue placeholder="Selecione o produto" />
              </SelectTrigger>
              <SelectContent>
                {produtos.map((product) => (
                  <SelectItem key={product.id} value={product.id.toString()}>
                    {product.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* KPIs do produto selecionado */}
        {selectedProduct && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            <KPICard
              title="Taxa de Ruptura"
              value={`${taxaRuptura.toFixed(1)}%`}
              subtitle={selectedProduct.alerta}
              icon={TrendingDown}
              variant={
                taxaRuptura === 100
                  ? "danger"
                  : taxaRuptura === 50
                  ? "warning"
                  : "success"
              }
            />
            <KPICard
              title="Giro de Estoque"
              value={`${giroEstoque.toFixed(2)}x`}
              subtitle="Últimas 4 semanas"
              icon={RotateCcw}
              variant="success"
            />
            <KPICard
              title="Custo de Ruptura"
              value={`R$ ${custoRuptura.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}`}
              subtitle="Estimativa por ruptura"
              icon={DollarSign}
              variant="warning"
            />
          </div>
        )}

        {/* Gráfico do produto selecionado */}
        {selectedProduct && (
          <div className="mb-8">
            <SalesChart data={chartData} />
          </div>
        )}

        {/* Estoque total agregado */}
        {estoqueTotalData.length > 0 && (
          <div className="mb-8 bg-card rounded-2xl p-4 shadow">
            <h2 className="text-lg font-semibold mb-4">
              Estoque Total x Vendas (Todas as categorias)
            </h2>
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

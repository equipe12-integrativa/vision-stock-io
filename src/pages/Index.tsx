import { useState } from "react";
import { KPICard } from "@/components/KPICard";
import { ProductTable, Product } from "@/components/ProductTable";
import { SalesChart } from "@/components/SalesChart";
import { 
  TrendingDown, 
  RotateCcw, 
  DollarSign,
  Package
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const produtosMock: Product[] = [
  {
    id: 1,
    nome: "Arroz 5kg",
    estoqueAtual: 120,
    previsao: { semana1: 126, semana2: 115, semana3: 108, semana4: 98 },
    estoqueZerandoEm: "2025-10-28",
    alerta: "⚠️ Ruptura iminente"
  },
  {
    id: 2,
    nome: "Feijão Carioca 1kg",
    estoqueAtual: 200,
    previsao: { semana1: 140, semana2: 132, semana3: 125, semana4: 120 },
    estoqueZerandoEm: "2025-11-05",
    alerta: "🟡 Estoque crítico"
  },
  {
    id: 3,
    nome: "Óleo de Soja 900ml",
    estoqueAtual: 500,
    previsao: { semana1: 90, semana2: 85, semana3: 80, semana4: 75 },
    estoqueZerandoEm: "2025-12-10",
    alerta: "✅ Estoque estável"
  },
  {
    id: 4,
    nome: "Açúcar Refinado 1kg",
    estoqueAtual: 80,
    previsao: { semana1: 95, semana2: 72, semana3: 65, semana4: 58 },
    estoqueZerandoEm: "2025-10-30",
    alerta: "⚠️ Ruptura iminente"
  },
  {
    id: 5,
    nome: "Café Torrado 500g",
    estoqueAtual: 150,
    previsao: { semana1: 110, semana2: 105, semana3: 98, semana4: 90 },
    estoqueZerandoEm: "2025-11-08",
    alerta: "🟡 Estoque crítico"
  },
];

const chartData = [
  { semana: "Semana 1", vendas: 126, estoque: 120 },
  { semana: "Semana 2", vendas: 115, estoque: 110 },
  { semana: "Semana 3", vendas: 108, estoque: 95 },
  { semana: "Semana 4", vendas: 98, estoque: 85 },
];

const Index = () => {
  const [selectedWeek, setSelectedWeek] = useState<"semana1" | "semana2" | "semana3" | "semana4">("semana1");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Package className="h-8 w-8 text-primary" />
                Gestão Inteligente de Estoques
              </h1>
              <p className="text-muted-foreground mt-1">
                Dashboard de previsão e alertas automatizados
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Select value={selectedWeek} onValueChange={(value) => setSelectedWeek(value as any)}>
                <SelectTrigger className="w-[180px] bg-background">
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semana1">Semana 1</SelectItem>
                  <SelectItem value="semana2">Semana 2</SelectItem>
                  <SelectItem value="semana3">Semana 3</SelectItem>
                  <SelectItem value="semana4">Semana 4</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <KPICard
            title="Taxa de Ruptura"
            value="8.5%"
            subtitle="↓ 2.3% vs. mês anterior"
            icon={TrendingDown}
            variant="danger"
          />
          <KPICard
            title="Giro de Estoque"
            value="4.2x"
            subtitle="↑ 0.8x vs. mês anterior"
            icon={RotateCcw}
            variant="success"
          />
          <KPICard
            title="Custo de Ruptura"
            value="R$ 12.4k"
            subtitle="Estimativa mensal"
            icon={DollarSign}
            variant="warning"
          />
        </div>

        {/* Chart */}
        <div className="mb-8">
          <SalesChart data={chartData} />
        </div>

        {/* Products Table */}
        <div>
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-foreground">
              Top 20% Produtos (Princípio de Pareto)
            </h2>
            <p className="text-muted-foreground">
              Produtos com maior impacto nas vendas e necessidade de atenção
            </p>
          </div>
          <ProductTable products={produtosMock} selectedWeek={selectedWeek} />
        </div>
      </main>
    </div>
  );
};

export default Index;

import { useState } from "react";
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

const produtosMock: Product[] = [
  {
    id: 300033,
    nome: "CABO FLEX 2,5MM AZUL CORFIO",
    unidade: "M",
    estoqueAtual: 21073.00,
    previsao: { semana1: 3000, semana2: 3000, semana3: 3000, semana4: 3000 },
    estoqueZerandoEm: "2025-12-07",
    alerta: "✅ Estoque estável"
  },
  {
    id: 11847,
    nome: "CABO FLEX 2,5MM PRETO CORFIO",
    unidade: "M",
    estoqueAtual: 19122.00,
    previsao: { semana1: 2500, semana2: 2500, semana3: 2500, semana4: 2500 },
    estoqueZerandoEm: "2025-12-14",
    alerta: "✅ Estoque estável"
  },
  {
    id: 101352,
    nome: "CABO FLEX 1,5MM AZUL CORFIO/RCM",
    unidade: "M",
    estoqueAtual: 13386.00,
    previsao: { semana1: 4500, semana2: 3500, semana3: 1000, semana4: 2000 },
    estoqueZerandoEm: "2025-11-06",
    alerta: "🟡 Estoque crítico"
  },
  {
    id: 101360,
    nome: "CABO FLEX 2,5MM VERDE CORFIO",
    unidade: "M",
    estoqueAtual: 11340.00,
    previsao: { semana1: 1500, semana2: 1500, semana3: 1500, semana4: 1500 },
    estoqueZerandoEm: "2025-12-08",
    alerta: "✅ Estoque estável"
  },
  {
    id: 15036,
    nome: "CABO ALUM XLPE+PVC 0,6/1KV 16MM PRETO",
    unidade: "M",
    estoqueAtual: 10074.00,
    previsao: { semana1: 5000, semana2: 2000, semana3: 500, semana4: 500 },
    estoqueZerandoEm: "2025-11-07",
    alerta: "🟡 Estoque crítico"
  },
  {
    id: 300031,
    nome: "CABO FLEX 1,5MM PRETO CORFIO/RCM",
    unidade: "M",
    estoqueAtual: 9985.00,
    previsao: { semana1: 3000, semana2: 3000, semana3: 3000, semana4: 3000 },
    estoqueZerandoEm: "2025-11-23",
    alerta: "✅ Estoque estável"
  },
  {
    id: 11844,
    nome: "CABO FLEX 1,5MM AMARELO CORFIO/RCM",
    unidade: "M",
    estoqueAtual: 8879.00,
    previsao: { semana1: 2000, semana2: 2000, semana3: 2000, semana4: 2000 },
    estoqueZerandoEm: "2025-11-26",
    alerta: "✅ Estoque estável"
  },
  {
    id: 50050,
    nome: "MODULO CEGO BRANCO PEZZI",
    unidade: "PC",
    estoqueAtual: 8668.00,
    previsao: { semana1: 3000, semana2: 1000, semana3: 1000, semana4: 500 },
    estoqueZerandoEm: "2025-12-09",
    alerta: "✅ Estoque estável"
  },
  {
    id: 101353,
    nome: "CABO FLEX 1,5MM VERMELHO CORFIO/RCM",
    unidade: "M",
    estoqueAtual: 7419.00,
    previsao: { semana1: 7000, semana2: 500, semana3: 0, semana4: 0 },
    estoqueZerandoEm: "2025-10-28",
    alerta: "⚠️ Ruptura iminente"
  },
  {
    id: 16079,
    nome: "BUCHA 6MM C/ACABAMENTO FIX",
    unidade: "PC",
    estoqueAtual: 7213.00,
    previsao: { semana1: 2000, semana2: 2000, semana3: 2000, semana4: 2000 },
    estoqueZerandoEm: "2025-11-25",
    alerta: "✅ Estoque estável"
  },
  {
    id: 303098,
    nome: "CABO COBERTO AL XLPE 2AWG CAA/35MM 25KV RURAL",
    unidade: "M",
    estoqueAtual: 6427.35,
    previsao: { semana1: 1500, semana2: 1500, semana3: 1500, semana4: 1500 },
    estoqueZerandoEm: "2025-11-24",
    alerta: "✅ Estoque estável"
  },
  {
    id: 99009,
    nome: "MODULO TOMADA 2P+T 20A BRANCO PEZZI",
    unidade: "PC",
    estoqueAtual: 5841.00,
    previsao: { semana1: 2500, semana2: 2000, semana3: 1500, semana4: 1000 },
    estoqueZerandoEm: "2025-11-08",
    alerta: "🟡 Estoque crítico"
  },
  {
    id: 101363,
    nome: "CABO FLEX 4,0MM AZUL CORFIO/RCM",
    unidade: "M",
    estoqueAtual: 5794.00,
    previsao: { semana1: 4000, semana2: 2000, semana3: 0, semana4: 0 },
    estoqueZerandoEm: "2025-11-04",
    alerta: "🟡 Estoque crítico"
  },
  {
    id: 305587,
    nome: "CABO ALUMINIO XLPE+PVC 0,6/1KV 35MM PRETO",
    unidade: "M",
    estoqueAtual: 5542.00,
    previsao: { semana1: 1000, semana2: 1000, semana3: 1000, semana4: 1000 },
    estoqueZerandoEm: "2025-11-30",
    "alerta": "✅ Estoque estável"
  },
  {
    id: 11848,
    nome: "CABO FLEX 4,0MM PRETO CORFIO/RCM",
    unidade: "M",
    estoqueAtual: 5404.00,
    previsao: { semana1: 1500, semana2: 1500, semana3: 1500, semana4: 1500 },
    estoqueZerandoEm: "2025-11-18",
    alerta: "✅ Estoque estável"
  },
  {
    id: 12376,
    nome: "CABO PP 2X2,5MM PRETO 1KV CORFIO",
    unidade: "M",
    estoqueAtual: 4477.60,
    previsao: { semana1: 1000, semana2: 1000, semana3: 1000, semana4: 1000 },
    estoqueZerandoEm: "2025-11-22",
    alerta: "✅ Estoque estável"
  },
  {
    id: 305686,
    nome: "DUTO PEAD 1.1/2\" KANADUTO SW KANAFLEX",
    unidade: "M",
    estoqueAtual: 4145.00,
    previsao: { semana1: 600, semana2: 600, semana3: 600, semana4: 600 },
    estoqueZerandoEm: "2025-12-07",
    alerta: "✅ Estoque estável"
  },
  {
    id: 11443,
    nome: "PARAFUSO MAD. PHILLIPS 3,5X40 VONDER",
    unidade: "PC",
    estoqueAtual: 4119.00,
    previsao: { semana1: 1000, semana2: 500, semana3: 500, semana4: 500 },
    estoqueZerandoEm: "2025-12-01",
    alerta: "✅ Estoque estável"
  },
  {
    id: 11849,
    nome: "CABO FLEX 6,0MM PRETO CORFIO/RCM",
    unidade: "M",
    estoqueAtual: 4097.00,
    previsao: { semana1: 1500, semana2: 1500, semana3: 1500, semana4: 1500 },
    estoqueZerandoEm: "2025-11-09",
    alerta: "🟡 Estoque crítico"
  },
  {
    id: 302736,
    nome: "MANGUEIRA CORRUGADA 3/4\" AMARELO KRONA",
    unidade: "M",
    estoqueAtual: 4080.00,
    previsao: { semana1: 1000, semana2: 1000, semana3: 1000, semana4: 1000 },
    estoqueZerandoEm: "2025-11-22",
    alerta: "✅ Estoque estável"
  },
  {
    id: 300016,
    nome: "CABO PP 2X1,5MM PRETO 500V CORFIO",
    unidade: "M",
    estoqueAtual: 4065.00,
    previsao: { semana1: 3000, semana2: 1000, semana3: 100, semana4: 100 },
    estoqueZerandoEm: "2025-11-03",
    alerta: "🟡 Estoque crítico"
  },
  {
    id: 101368,
    nome: "CABO FLEX 6,0MM AZUL CORFIO/RCM",
    unidade: "M",
    estoqueAtual: 3903.00,
    previsao: { semana1: 1000, semana2: 1000, semana3: 1000, semana4: 1000 },
    estoqueZerandoEm: "2025-11-21",
    alerta: "✅ Estoque estável"
  },
  {
    id: 101354,
    nome: "CABO FLEX 1,5MM BRANCO CORFIO/RCM",
    unidade: "M",
    estoqueAtual: 3642.00,
    previsao: { semana1: 500, semana2: 500, semana3: 500, semana4: 500 },
    estoqueZerandoEm: "2025-12-14",
    alerta: "✅ Estoque estável"
  },
  {
    id: 300855,
    nome: "PARAFUSO MAD. PHILLIPS 4,5X30 VONDER",
    unidade: "PC",
    estoqueAtual: 3502.00,
    previsao: { semana1: 3000, semana2: 500, semana3: 0, semana4: 0 },
    estoqueZerandoEm: "2025-10-27",
    alerta: "⚠️ Ruptura iminente"
  },
  {
    id: 301337,
    nome: "ABRACADEIRA COM TRAVA 3/4'' BRANCO INPOL",
    unidade: "PC",
    estoqueAtual: 3351.00,
    previsao: { semana1: 500, semana2: 500, semana3: 500, semana4: 500 },
    estoqueZerandoEm: "2025-12-07",
    alerta: "✅ Estoque estável"
  },
  {
    id: 97653,
    nome: "CABO FLEX 2,5MM VERMELHO CORFIO",
    unidade: "M",
    estoqueAtual: 2779.00,
    previsao: { semana1: 2000, semana2: 1000, semana3: 0, semana4: 0 },
    estoqueZerandoEm: "2025-11-04",
    alerta: "🟡 Estoque crítico"
  },
  {
    id: 305685,
    nome: "DUTO PEAD 1\" KANADUTO SW KANAFLEX",
    unidade: "M",
    estoqueAtual: 2730.00,
    previsao: { semana1: 500, semana2: 500, semana3: 500, semana4: 500 },
    estoqueZerandoEm: "2025-12-01",
    alerta: "✅ Estoque estável"
  },
  {
    id: 95318,
    nome: "CABO 1KV HEPR FLEX 10MM AZUL CORFIO",
    unidade: "M",
    estoqueAtual: 2568.00,
    previsao: { semana1: 2000, semana2: 100, semana3: 100, semana4: 100 },
    estoqueZerandoEm: "2025-10-31",
    alerta: "⚠️ Ruptura iminente"
  },
  {
    id: 101372,
    nome: "CABO FLEX 10MM AZUL CORFIO/RCM",
    unidade: "M",
    estoqueAtual: 2433.00,
    previsao: { semana1: 800, semana2: 800, semana3: 800, semana4: 800 },
    estoqueZerandoEm: "2025-11-13",
    alerta: "🟡 Estoque crítico"
  },
  {
    id: 303521,
    nome: "BASTIDOR 4X2 PEZZI",
    unidade: "PC",
    estoqueAtual: 2345.00,
    previsao: { semana1: 500, semana2: 500, semana3: 500, semana4: 500 },
    estoqueZerandoEm: "2025-11-28",
    alerta: "✅ Estoque estável"
  },
  {
    id: 11850,
    nome: "CABO FLEX 10MM PRETO CORFIO/RCM",
    unidade: "M",
    estoqueAtual: 2329.00,
    previsao: { semana1: 1000, semana2: 1000, semana3: 1000, semana4: 1000 },
    estoqueZerandoEm: "2025-11-09",
    alerta: "🟡 Estoque crítico"
  },
  {
    id: 14156,
    nome: "ABRACADEIRA PLASTICA 200X4,8MM PRETA FRONTEC",
    unidade: "PC",
    estoqueAtual: 2224.00,
    previsao: { semana1: 500, semana2: 500, semana3: 500, semana4: 500 },
    estoqueZerandoEm: "2025-11-27",
    alerta: "✅ Estoque estável"
  },
  {
    id: 50130,
    nome: "PLACA + BASTIDOR 4X2 CLASSICA MOD BRANCO PEZZI",
    unidade: "PC",
    estoqueAtual: 2223.00,
    previsao: { semana1: 300, semana2: 300, semana3: 300, semana4: 300 },
    estoqueZerandoEm: "2025-12-11",
    alerta: "✅ Estoque estável"
  },
  {
    id: 300742,
    nome: "CABO PARALELO 300V 2X1,5MM BRANCO RCM/CORFIO",
    unidade: "M",
    estoqueAtual: 2193.00,
    previsao: { semana1: 1500, semana2: 500, semana3: 0, semana4: 0 },
    estoqueZerandoEm: "2025-10-31",
    alerta: "⚠️ Ruptura iminente"
  },
  {
    id: 11839,
    nome: "CABO 1KV HEPR FLEX 10MM PRETO CORFIO",
    unidade: "M",
    estoqueAtual: 2136.30,
    previsao: { semana1: 1000, semana2: 500, semana3: 0, semana4: 0 },
    estoqueZerandoEm: "2025-11-06",
    alerta: "🟡 Estoque crítico"
  },
  {
    id: 302767,
    nome: "LAMPADA LED TUBULAR T8 18W 6500K BLUMENAU",
    unidade: "PC",
    estoqueAtual: 2117.00,
    previsao: { semana1: 500, semana2: 500, semana3: 500, semana4: 500 },
    estoqueZerandoEm: "2025-11-26",
    alerta: "✅ Estoque estável"
  }
];

const calculateChartData = (products: Product[]) => {
  const weeks = ["semana1", "semana2", "semana3", "semana4"] as const;

  const salesByWeek: { [key: string]: number } = weeks.reduce((acc, week) => {
    acc[week] = products.reduce((sum, product) => sum + product.previsao[week], 0);
    return acc;
  }, {} as { [key: string]: number });

  let totalStock = products.reduce((sum, product) => sum + product.estoqueAtual, 0);

  const newChartData = weeks.map((week, index) => {
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

  return newChartData;
};

const calculateChartDataByProduct = (product: Product) => {
  const weeks = ["semana1", "semana2", "semana3", "semana4"] as const;
  let stock = product.estoqueAtual;

  return weeks.map((week, index) => {
    const vendas = product.previsao[week];
    const dataPoint = {
      semana: `Semana ${index + 1}`,
      vendas,
      estoque: stock,
    };
    stock -= vendas;
    return dataPoint;
  });
};

// --- Função para gráfico de status ---
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

const Index = () => {
  const [selectedProductId, setSelectedProductId] = useState<string>(produtosMock[0].id.toString());

  const selectedProduct = produtosMock.find(p => p.id === Number(selectedProductId))!;
  const chartData = calculateChartDataByProduct(selectedProduct);
  const estoqueTotalData = calculateChartData(produtosMock);
  const statusSummary = calculateStatusSummary(produtosMock);

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
              <Select value={selectedProductId} onValueChange={setSelectedProductId}>
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
        <div className="mb-8">
          <SalesChart data={chartData} />
        </div>

        {/* Novo gráfico 1: Estoque total agregado por semana */}
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

        {/* Novo gráfico 2: Distribuição de status */}
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
      </main>
    </div>
  );
};

export default Index;

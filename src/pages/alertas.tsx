import { useState } from "react";
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

interface Product {
 id: number;
 nome: string;
 unidade: string;
 estoqueAtual: number;
 previsao: { semana1: number; semana2: number; semana3: number; semana4: number };
 estoqueZerandoEm: string;
 alerta: string;
}

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

const Alertas = () => {
 const [searchQuery, setSearchQuery] = useState("");
 const [statusFilter, setStatusFilter] = useState("todos");
 const [unidadeFilter, setUnidadeFilter] = useState("todas");
 const [sortBy, setSortBy] = useState("estoque-desc");
 const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
 const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

 const filteredProducts = produtosMock
  .filter(product => {
   const matchesSearch = product.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.id.toString().includes(searchQuery);
   const matchesStatus = statusFilter === "todos" ||
    (statusFilter === "ruptura" && product.alerta.includes("Ruptura iminente")) ||
    (statusFilter === "critico" && product.alerta.includes("crítico")) ||
    (statusFilter === "estavel" && product.alerta.includes("estável"));
   const matchesUnidade = unidadeFilter === "todas" || product.unidade === unidadeFilter;

   return matchesSearch && matchesStatus && matchesUnidade;
  })
  .sort((a, b) => {
   switch (sortBy) {
    case "estoque-desc":
     return b.estoqueAtual - a.estoqueAtual;
    case "estoque-asc":
     return a.estoqueAtual - b.estoqueAtual;
    case "nome-asc":
     return a.nome.localeCompare(b.nome);
    case "nome-desc":
     return b.nome.localeCompare(a.nome);
    default:
     return 0;
   }
  });

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
   <header className="border-b shadow-sm">
    <div className="container mx-auto px-4 sm:px-6 py-6">
     <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
       <Package className="h-8 w-8 text-blue-600" />
       <div>
        <h1 className="text-2xl sm:text-3xl font-bold">
         Alertas e Previsões
        </h1>
        <p className="text-sm mt-1">
         {filteredProducts.length} produtos encontrados
        </p>
       </div>
      </div>
      <Button
       onClick={() => setIsSearchModalOpen(true)}
       className="bg-blue-600 hover:bg-blue-700"
      >
       <Search className="h-4 w-4 mr-2" />
       Busca Avançada
      </Button>
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
         <div className="text-xs font-semibold mb-1 text-foreground/70">
          ID: {product.id}
         </div>
         <h3 className="font-semibold text-sm leading-tight text-foreground">
          {product.nome}
         </h3>
        </div>
        {getAlertIcon(product.alerta)}
       </div>

       <div className="space-y-2">
        <div className="flex justify-between items-center">
         <span className="text-xs text-foreground/70">Estoque Atual:</span>
         <span className="font-bold text-foreground">
          {product.estoqueAtual.toLocaleString('pt-BR')} {product.unidade}
         </span>
        </div>

        <div className="flex justify-between items-center">
         <span className="text-xs text-foreground/70">Zerando em:</span>
         <span className="text-xs font-medium text-foreground">
          {new Date(product.estoqueZerandoEm).toLocaleDateString('pt-BR')}
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
      <h3 className="text-lg font-semibold mb-2">
       Nenhum produto encontrado
      </h3>
      <p>
       Tente ajustar os filtros ou termo de busca
      </p>
     </div>
    )}
   </main>

   {isSearchModalOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
     <div className="rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
      <div className="p-6 border-b flex items-center justify-between">
       <h2 className="text-xl font-bold">Busca Avançada</h2>
       <button
        onClick={() => setIsSearchModalOpen(false)}
        className="text-gray-400 hover:text-gray-600"
       >
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
            <div className="text-sm font-semibold">
             {product.nome}
            </div>
            <div className="text-xs">ID: {product.id}</div>
           </div>
           <div className="text-right">
            <div className="text-sm font-bold">
             {product.estoqueAtual.toLocaleString('pt-BR')} {product.unidade}
            </div>
            <div className="text-xs">{product.alerta}</div>
           </div>
          </div>
         </div>
        ))}

        {filteredProducts.length === 0 && (
         <div className="text-center py-6 text-sm text-gray-500">
          Nenhum resultado encontrado.
         </div>
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

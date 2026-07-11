import { Card } from "@/components/ui/card/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useEffect, useState } from "react";
import { useVales } from '@/hooks/useVales';
import { Badge } from "@/components/ui/badge";
import { getVales, Vale } from "@/services/api";

// Tipos para os dados agregados
type AgrupamentoCliente = { nome: string; vales: number; paletes: number; valor: number; };
type AgrupamentoTransportadora = { nome: string; vales: number; paletes: number; };

const ValesAcumulados = () => {
  const { loading } = useVales();
  const [vales, setVales] = useState<Vale[]>([]);
  const [clientesAgregados, setClientesAgregados] = useState<AgrupamentoCliente[]>([]);
  const [transportadorasAgregadas, setTransportadorasAgregadas] = useState<AgrupamentoTransportadora[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVales = async () => {
      setError(null);
      try {
        const fetchVales = await getVales();
        const data = fetchVales.data.filter((vale) => vale.status === "acumulado");
        setVales(data);

        // --- Agrupar por cliente ---
        const clientesMap = new Map<string, AgrupamentoCliente>();
        // --- Agrupar por transportadora ---
        const transportadorasMap = new Map<string, AgrupamentoTransportadora>();

        data.forEach(vale => {
          const clienteAtual = clientesMap.get(vale.cliente) || { nome: vale.cliente, vales: 0, paletes: 0, valor: 0 };
          clienteAtual.vales++;
          clienteAtual.paletes += vale.quantidade;
          clienteAtual.valor += vale.quantidade * (vale.valorUnitario || 0);
          clientesMap.set(vale.cliente, clienteAtual);

          const transpNome = vale.transportadora || "Sem Transportadora";
          const transpAtual = transportadorasMap.get(transpNome) || { nome: transpNome, vales: 0, paletes: 0 };
          transpAtual.vales++;
          transpAtual.paletes += vale.quantidade;
          transportadorasMap.set(transpNome, transpAtual);
        });

        setClientesAgregados(Array.from(clientesMap.values()).sort((a, b) => b.valor - a.valor));
        setTransportadorasAgregadas(Array.from(transportadorasMap.values()).sort((a, b) => b.paletes - a.paletes));

      } catch (e) {
        console.error(e);
        setError("Falha ao carregar os vales.");
      }
    };

    fetchVales();
  }, []);

  if (loading) return <div className="p-6 text-center">Carregando dados...</div>
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  const totalVales = vales.length;
  const totalPaletes = vales.reduce((acc, vale) => acc + vale.quantidade, 0);
  const valorEstimado = vales.reduce((acc, vale) => acc + vale.quantidade * (vale.valorUnitario || 0), 0);

  const pieData = clientesAgregados.map(c => ({ name: c.nome, value: c.paletes }));
  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#eab308'];

  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Vale Paletes Acumulados</h1>
        <p className="text-gray-600">Visualização dos vales em aberto por cliente e transportadora</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100"></Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100"></Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100"></Card>
      </div>

      <Tabs defaultValue="clientes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="clientes">Por Cliente</TabsTrigger>
          <TabsTrigger value="transportadoras">Por Transportadora</TabsTrigger>
        </TabsList>

        {/* --- Por Cliente --- */}
        <TabsContent value="clientes" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
            </Card>

            <Card>
            </Card>
          </div>
        </TabsContent>

        {/* --- Por Transportadora --- */}
        <TabsContent value="transportadoras" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
            </Card>

            <Card>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ValesAcumulados;

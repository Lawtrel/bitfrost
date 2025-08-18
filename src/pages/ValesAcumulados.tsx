import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useEffect, useState } from "react";
import { useVales, Vale } from '@/hooks/useVales'; // Importe o hook
import { Badge } from "@/components/ui/badge";

// Tipos para os dados agregados
type AgrupamentoCliente = { nome: string; vales: number; paletes: number; valor: number; };

const ValesAcumulados = () => {
    const { buscarVales, loading } = useVales(); // Use o hook
    const [vales, setVales] = useState<Vale[]>([]);
    const [clientesAgregados, setClientesAgregados] = useState<AgrupamentoCliente[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVales = async () => {
            setError(null);
            try {
                // Busca apenas os vales com status 'acumulado'
                const data = await buscarVales('valescadastrados', 'acumulado');
                setVales(data);

                // Processa os dados para agrupar por cliente
                const clientesMap = new Map<string, AgrupamentoCliente>();
                data.forEach(vale => {
                    const clienteAtual = clientesMap.get(vale.cliente) || { nome: vale.cliente, vales: 0, paletes: 0, valor: 0 };
                    clienteAtual.vales++;
                    clienteAtual.paletes += vale.quantidade;
                    clienteAtual.valor += vale.quantidade * (vale.valorUnitario || 0);
                    clientesMap.set(vale.cliente, clienteAtual);
                });
                setClientesAgregados(Array.from(clientesMap.values()).sort((a, b) => b.valor - a.valor));

            } catch (e) {
                console.error(e);
                setError("Falha ao carregar os vales.");
            }
        };

        fetchVales();
    }, []);

    if (loading) return <div className="p-6 text-center">Carregando dados...</div>
    if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

    // Dados para os cards de resumo
    const totalVales = vales.length;
    const totalPaletes = vales.reduce((acc, vale) => acc + vale.quantidade, 0);
    const valorEstimado = vales.reduce((acc, vale) => acc + vale.quantidade * (vale.valorUnitario || 0), 0);

    // Dados para o gráfico de pizza
    const pieData = clientesAgregados.map(c => ({ name: c.nome, value: c.paletes }));
    const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#eab308'];

    return (
        <div className="p-6 space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Vale Paletes Acumulados</h1>
                <p className="text-gray-600">Visualização dos vales em aberto por cliente e transportadora</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100"><CardHeader className="pb-2"><CardTitle className="text-blue-700">Total de Vales</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold text-blue-800">{totalVales}</p><p className="text-sm text-blue-600">Em aberto</p></CardContent></Card>
                <Card className="bg-gradient-to-br from-green-50 to-green-100"><CardHeader className="pb-2"><CardTitle className="text-green-700">Total de Paletes</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold text-green-800">{totalPaletes}</p><p className="text-sm text-green-600">Aguardando retorno</p></CardContent></Card>
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100"><CardHeader className="pb-2"><CardTitle className="text-purple-700">Valor Estimado</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold text-purple-800">R$ {(valorEstimado / 1000).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} K</p><p className="text-sm text-purple-600">Em circulação</p></CardContent></Card>
            </div>

            <Tabs defaultValue="clientes" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="clientes">Por Cliente</TabsTrigger>
                    <TabsTrigger value="transportadoras">Por Transportadora</TabsTrigger>
                </TabsList>
                <TabsContent value="clientes" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader><CardTitle>Distribuição por Cliente</CardTitle></CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={400}>
                                    <PieChart>
                                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={120} paddingAngle={5} dataKey="value" nameKey="name">
                                            {pieData.map((_entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                                        </Pie>
                                        <Tooltip formatter={(value) => [`${value} paletes`, 'Quantidade']} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle>Ranking de Clientes</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                {clientesAgregados.slice(0, 5).map((cliente, index) => (
                                    <div key={cliente.nome} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <div className="flex items-center gap-2"><Badge variant="outline" className="text-xs">#{index + 1}</Badge><p className="font-medium text-gray-800">{cliente.nome}</p></div>
                                            <p className="text-sm text-gray-600">{cliente.vales} vales • {cliente.paletes} paletes</p>
                                        </div>
                                        <div className="text-right"><p className="font-semibold text-gray-800">R$ {(cliente.valor / 1000).toFixed(0)}K</p></div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                <TabsContent value="transportadoras">
                    <p className="text-center text-gray-500 p-8">A visualização por transportadora será implementada em breve.</p>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ValesAcumulados;
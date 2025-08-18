import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, AlertTriangle, Users, Truck, Package, FileText, Hourglass } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

interface ValesProps {
  id: string;
  transportadora: string;
  cliente: string;
  quantidade: number;
  valorUnitario: number;
  dataVencimento: string;
  dataCriacao: string;
  status: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [valesCadastrados, setValesCadastrados] = useState<ValesProps[]>([]);
  const [valesVencidos, setValesVencidos] = useState<ValesProps[]>([]);
  const [valesProcessados, setValesProcessados] = useState<ValesProps[]>([]);
  const [qtdTransportadoras, setQtdTransportadoras] = useState(0);
  const [qtdClientes, setQtdClientes] = useState(0);
  const [cadastradosAtual, setCadastradosAtual] = useState(0);
  const [vencidosAtual, setVencidosAtual] = useState(0);
  const [processadosAtual, setProcessadosAtual] = useState(0);
  const [vencidosAnterior, setVencidosAnterior] = useState(0);
  const [valesData, setValesData] = useState<{ mes: string; pendentes: number; vencidos: number; processados: number }[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setOrganizationId(user.uid);
      } else {
        console.log("Nenhum usuário logado. Redirecionando para login.");
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const buscaTodosOsVales = async () => {
      if (!organizationId) return;

      try {
        const fetchCollection = async (collectionName: string): Promise<ValesProps[]> => {
          const q = query(collection(db, collectionName), where("organizationId", "==", organizationId));
          const snapshot = await getDocs(q);
          return snapshot.docs.map(doc => {
            const data = doc.data();
            
            // --- CORREÇÃO APLICADA AQUI ---
            // Esta função lida com datas que podem ser Timestamps ou strings
            const converterData = (dataCampo: any): string => {
                if (!dataCampo) return new Date().toISOString();
                // Se for um objeto Timestamp do Firebase, converte para Date e depois para ISO string
                if (dataCampo.toDate) {
                    return dataCampo.toDate().toISOString();
                }
                // Se já for uma string (ou outro formato), apenas cria um objeto Date e converte
                return new Date(dataCampo).toISOString();
            };

            return {
              id: doc.id,
              ...data,
              dataCriacao: converterData(data.dataCriacao),
              dataVencimento: converterData(data.dataVencimento),
            } as ValesProps;
          });
        };
        
        const transportadorasQuery = query(collection(db, "transportadoras"), where("organizationId", "==", organizationId));
        const clientesQuery = query(collection(db, "clientes"), where("organizationId", "==", organizationId));
        const [transportadorasSnap, clientesSnap] = await Promise.all([getDocs(transportadorasQuery), getDocs(clientesQuery)]);
        setQtdTransportadoras(transportadorasSnap.size);
        setQtdClientes(clientesSnap.size);

        const [dataCadastrados, dataVencidos, dataProcessados] = await Promise.all([
          fetchCollection("valescadastrados"),
          fetchCollection("valesvencidos"),
          fetchCollection("valesprocessados"),
        ]);

        setValesCadastrados(dataCadastrados);
        setValesVencidos(dataVencidos);
        setValesProcessados(dataProcessados);

      } catch (error) {
        console.error("Erro ao buscar dados do Dashboard:", error);
      }
    };

    if (organizationId) {
        buscaTodosOsVales();
    }
  }, [organizationId]);
  
  // O restante do seu componente continua igual...

  const formatarMesAbreviado = (isoDate: string) => new Date(isoDate).toLocaleDateString("pt-BR", { month: "short" });
  const formatarMes = (isoDate: string) => new Date(isoDate).toLocaleDateString("pt-BR", { month: "long" });
  const getMesAnteriorFormatado = () => new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toLocaleDateString("pt-BR", { month: "long" });

  useEffect(() => {
    const agruparPorMes = (vales: ValesProps[]) => {
      return vales.reduce<Record<string, number>>((acc, vale) => {
        const mes = formatarMesAbreviado(vale.dataCriacao);
        acc[mes] = (acc[mes] || 0) + 1;
        return acc;
      }, {});
    };

    const montarValesData = (cadastrados: ValesProps[], vencidos: ValesProps[], processados: ValesProps[]) => {
      const mesesCadastrados = agruparPorMes(cadastrados);
      const mesesVencidos = agruparPorMes(vencidos);
      const mesesProcessados = agruparPorMes(processados);
      const meses = new Set([...Object.keys(mesesCadastrados), ...Object.keys(mesesVencidos), ...Object.keys(mesesProcessados)]);
      const ordemMeses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
      
      const resultado = Array.from(meses).map(mes => ({
        mes,
        pendentes: mesesCadastrados[mes] || 0,
        vencidos: mesesVencidos[mes] || 0,
        processados: mesesProcessados[mes] || 0,
      }));
      
      resultado.sort((a, b) => ordemMeses.indexOf(a.mes.replace('.', '')) - ordemMeses.indexOf(b.mes.replace('.', '')));
      return resultado;
    };

    const mesAtual = formatarMes(new Date().toISOString());
    const mesAnterior = getMesAnteriorFormatado();

    setCadastradosAtual(valesCadastrados.filter(v => formatarMes(v.dataCriacao) === mesAtual).length);
    setVencidosAtual(valesVencidos.filter(v => formatarMes(v.dataCriacao) === mesAtual).length);
    setProcessadosAtual(valesProcessados.filter(v => formatarMes(v.dataCriacao) === mesAtual).length);
    setVencidosAnterior(valesVencidos.filter(v => formatarMes(v.dataCriacao) === mesAnterior).length);
    
    setValesData(montarValesData(valesCadastrados, valesVencidos, valesProcessados));

  }, [valesCadastrados, valesVencidos, valesProcessados]);


  const calcularDiferencaPercentual = (atual: number, anterior: number) => {
    if (anterior === 0) return atual === 0 ? 0 : 100;
    return ((atual - anterior) / anterior) * 100;
  };

  const diferencaVencidos = calcularDiferencaPercentual(vencidosAtual, vencidosAnterior);

  const statusData = [
    { name: "Pendentes", value: cadastradosAtual, color: "#fde047" },
    { name: "Vencidos", value: vencidosAtual, color: "#ef4444" },
    { name: "Processados", value: processadosAtual, color: "#3b82f6" },
  ];

  const topClientes = [
    { nome: "Indústria ABC Ltda", vales: 15, valor: "R$ 45.000" },
    { nome: "Metalúrgica XYZ S.A.", vales: 12, valor: "R$ 36.000" },
    { nome: "Química DEF Ind.", vales: 8, valor: "R$ 24.000" },
    { nome: "Construção GHI Corp", vales: 6, valor: "R$ 18.000" }
  ];

  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Cargo Token</h1>
            <p className="text-blue-100 text-lg">Controle inteligente de movimentação de paletes</p>
            <div className="flex items-center gap-4 mt-4">
              <Badge className="bg-green-500/20 text-green-100 border-green-300">
                ✓ Sistema Ativo
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-100 border-blue-300">
                🚀 Inovação Digital
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{processadosAtual}</div>
            <div className="text-blue-200">Vales Processados</div>
            <div className="text-sm text-blue-300 mt-1">Este mês</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-sm font-medium">Vales Pendentes</p>
                <p className="text-3xl font-bold text-yellow-800">{cadastradosAtual}</p>
              </div>
              <div className="bg-yellow-500 p-3 rounded-xl">
                <Hourglass className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm font-medium">Vales Vencidos</p>
                <p className="text-3xl font-bold text-red-800">{vencidosAtual}</p>
                <p className="text-red-600 text-xs mt-1">↘ {diferencaVencidos.toFixed(2)}% vs mês anterior</p>
              </div>
              <div className="bg-red-500 p-3 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Transportadoras</p>
                <p className="text-3xl font-bold text-blue-800">{qtdTransportadoras}</p>
                <p className="text-blue-600 text-xs mt-1">Parceiros ativos</p>
              </div>
              <div className="bg-blue-500 p-3 rounded-xl">
                <Truck className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Clientes</p>
                <p className="text-3xl font-bold text-purple-800">{qtdClientes}</p>
                <p className="text-purple-600 text-xs mt-1">Base ativa</p>
              </div>
              <div className="bg-purple-500 p-3 rounded-xl">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button 
          onClick={() => navigate('/dashboard/baixar-vale')}
          className="h-16 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg"
        >
          <FileText className="mr-2 h-5 w-5" />
          Processar Vales Recebidos
        </Button>
        <Button 
          onClick={() => navigate('/dashboard/criar-vale')}
          className="h-16 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
        >
          <Package className="mr-2 h-5 w-5" />
          Criar Novo Vale
        </Button>
        <Button 
          onClick={() => navigate('/dashboard/vales-vencidos')}
          className="h-16 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg"
        >
          <AlertTriangle className="mr-2 h-5 w-5" />
          Verificar Vencidos
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Evolução Mensal dos Vales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={valesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="pendentes" fill="#fde047" name="Pendentes" />
                <Bar dataKey="vencidos" fill="#ef4444" name="Vencidos" />
                <Bar dataKey="processados" fill="#3b82f6" name="Processados" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Package className="h-5 w-5 text-purple-600" />
              Status Atual dos Vales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {statusData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Users className="h-5 w-5 text-green-600" />
            Top Clientes por Volume
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topClientes.map((cliente, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{cliente.nome}</h3>
                    <p className="text-sm text-gray-500">{cliente.vales} vales ativos</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">{cliente.valor}</p>
                  <p className="text-sm text-gray-500">Volume financeiro</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="bg-white rounded-xl p-6 shadow-lg border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-800">98.5%</div>
            <div className="text-sm text-gray-600">Taxa de Processamento</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">2.3 dias</div>
            <div className="text-sm text-gray-600">Tempo Médio</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">R$ 2.4M</div>
            <div className="text-sm text-gray-600">Valor Movimentado</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">45%</div>
            <div className="text-sm text-gray-600">Redução de Papel</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
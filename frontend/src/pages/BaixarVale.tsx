import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card/card"; 
import  Button  from "@/components/ui/button/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Search, Filter, Eye, CheckCircle, Clock, AlertTriangle, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { getVales, updateArquivoVale, updateValeStatus, Vale } from "@/services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const BaixarVale = () => {
  const [vales, setVales] = useState<Vale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState("");
  const [transportadoraFiltro, setTransportadoraFiltro] = useState("");
  const [modalVale, setModalVale] = useState<Vale | null>(null);
  const { toast } = useToast();
  const [valeSelecionado, setValeSelecionado] = useState<Vale | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [openModalUpload, setOpenModalUpload] = useState(false);

  const fetchVales = async () => {
  setLoading(true);
  setError(null);
  try {
    // 1. Buscar todos os vales via API
    const response = await getVales();
    const todosVales = response.data; // Vale[]
    console.log("Todos os vales:", todosVales);

    // 2. Filtrar só os “cadastrados” (ou “acumulado”, conforme seu status)
    const data = todosVales.filter((vale) => vale.status === "acumulado");
    console.log("Vales com status acumulado:", data);

    // 3. Verificar vencidos: se a data de vencimento já passou
    const hoje = new Date();

    // map para “atualizar status” localmente
    const valesAtivos = data.map(v => {
      const venc = new Date(v.dataVencimento);
      const novoStatus = venc < hoje ? "vencido" : v.status;
      return {
        ...v,
        status: novoStatus,
      };
    });

    const valesVencidos = valesAtivos.filter(v => v.status === "vencido");
    const valesPendentes = valesAtivos.filter(v => v.status !== "vencido");

    // 4. Atualizar no backend para os vales vencidos
    for (const vale of valesVencidos) {
      try {
        await updateValeStatus(vale.id, "vencido");
        console.log(`Vale ${vale.id} atualizado para vencido via API`);
      } catch (err) {
        console.error(`Erro ao atualizar status do vale ${vale.id}:`, err);
      }
    }

    // 5. Ajustar estado local com vales que não são vencidos
    setVales(valesPendentes);

  } catch (e) {
    console.error("Erro ao buscar dados do Dashboard:", e);
    setError("Falha ao carregar os vales.");
  } finally {
    setLoading(false);
  }
};

// Uso dentro de useEffect
useEffect(() => {
  fetchVales();
}, []);


const darBaixa = async (id: string) => {
  try {
    // 1. Encontrar o vale na lista local
    const valeParaBaixar = vales.find(vale => vale.id === id);
    if (!valeParaBaixar) {
      toast({
        title: "Erro",
        description: "Vale não encontrado",
        variant: "destructive",
      });
      return;
    }

    // 2. Chamar a API para atualizar o status para "processado"
    await updateValeStatus(id, "processado");

    // 3. Atualizar o estado local removendo ele dos pendentes
    setVales(old => old.filter(vale => vale.id !== id));

    toast({
      title: "✅ Vale processado com sucesso!",
      description: `Vale ${id} foi baixado e removido da lista pendente.`,
    });
  } catch (err: any) {
    console.error(err);
    toast({
      title: "Erro",
      description: "Falha ao processar o vale. Tente novamente.",
      variant: "destructive",
    });
  }
};

  const valesFiltrados = vales.filter(vale => {
    const clienteMatch = vale.cliente.toLowerCase().includes(filtro.toLowerCase());
    const transportadoraMatch =  vale.transportadora.toLowerCase().includes(transportadoraFiltro.toLowerCase());
    return clienteMatch && transportadoraMatch;
  }).sort((a, b) => {
      const dataA = new Date(a.dataVencimento).getTime();
      const dataB = new Date(b.dataVencimento).getTime();
      return dataA - dataB; // mais próximo primeiro
    });;
  const transportadoras = Array.from(new Set(vales.map(vale => vale.transportadora ?? ""))).filter(t => t);

  const getStatusColor = (dataVencimento: string) => {
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    const diffDays = Math.ceil((vencimento.getTime() - hoje.getTime()) / (1000 * 3600 * 24));
    if (diffDays < 0) return "text-red-600 bg-red-50";
    if (diffDays <= 3){
      return "text-orange-600 bg-orange-50";
    } 
    return "text-green-600 bg-green-50";
  };

  const getStatusIcon = (dataVencimento: string) => {
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    const diffDays = Math.ceil((vencimento.getTime() - hoje.getTime()) / (1000 * 3600 * 24));
    if (diffDays < 0) return <AlertTriangle className="w-4 h-4" />;
    if (diffDays <= 3) return <Clock className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  if (loading) return <div className="p-6 text-center">Carregando vales...</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;
  const confirmarContato = async () => {
    if (!valeSelecionado) return;

    try {
      // Envia para processados e remove dos cadastrados
      await darBaixa(valeSelecionado.id);

      setVales(old => old.filter(v => v.id !== valeSelecionado.id));
      setOpenModal(false);

      toast({
        title: "📞 Cliente contatado!",
        description: `Vale ${valeSelecionado.id} foi movido para processados.`,
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Erro",
        description: "Falha ao processar o contato. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const baixarPDF = (vale: Vale) => {
    const doc = new jsPDF();
    const dataVencimentoFormatada = vale.dataVencimento
        ? new Date(vale.dataVencimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
        : '-';

    doc.setFontSize(18);
    doc.text(`Detalhes do Vale - VP-${vale.id}`, 14, 22);

    autoTable(doc, {
      startY: 30,
      head: [["Campo", "Valor"]],
      body: [
        ["Cliente", vale.cliente || "-"],
        ["Transportadora", vale.transportadora || "-"],
        ["Quantidade", `${vale.quantidade || 0} paletes`],
        ["Valor Unitário", `R$ ${vale.valorUnitario?.toFixed(2) || '0.00'}`],
        ["Data de Vencimento", dataVencimentoFormatada],
        ["Observações", vale.observacoes || "-"]
      ],
      theme: 'striped'
    });

    doc.save(`vale-${vale.id}.pdf`);
  };

  return (
    <>
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Processar Vales Recebidos</h1>
            <p className="text-green-100">Gerencie e dê baixa nos vales palete recebidos</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{vales.filter(vale => new Date(vale.dataVencimento) >= new Date()).length}</div>
            <div className="text-green-200">Vales Ativos</div>
          </div>
        </div>
      </div>

      {/* Filters Card */}
      <Card className="shadow-lg border-0">
      </Card>

      {/* Results Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 font-medium">
            📊 Encontrados {valesFiltrados.length} vale(s) correspondente(s) aos filtros aplicados
          </p>
        </div>

      {/* Vales List */}
      <div className="space-y-4">
        {valesFiltrados.map(vale => (
          <Card key={vale.id} className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-green-500">
            
          </Card>
        ))}
      </div>
    </div>
    {/* Summary Footer */}
      {vales.length > 0 && (
        <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-0 shadow-lg">
          
        </Card>
      )}
    </>
  );
};

export default BaixarVale;

import ValeDetails from '@/components/ValeDetails';
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card/card";
import  Button  from "@/components/ui/Button/button";
import { Eye, Download, Search, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Importando o Label
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { getVales, Vale } from "@/services/api";

const ValesProcessados = () => {
  const [vales, setVales] = useState<Vale[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState("");
  const [transportadoraFiltro, setTransportadoraFiltro] = useState("");
  const [selectedVale, setSelectedVale] = useState<string | null>(null);
  const [modalVale, setModalVale] = useState<Vale | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVales = async () => {
      setError(null);
      try {
        // A mágica acontece aqui: buscando os vales 'processados' do Firebase
        const fetchVales = await getVales();
        const data = fetchVales.data.filter((vale) => vale.status === "processado");
        setVales(data);
        console.log(data);
        setLoading(false);
      } catch (e) {
        setError("Falha ao carregar os vales processados.");
      }
    };
    fetchVales();
  }, []); // O array vazio garante que a busca ocorra apenas uma vez

  const visualizarVale = (id: string) => {
    setSelectedVale(selectedVale === id ? null : id);
  };

  const baixarPDF = (vale: Vale) => {
    const doc = new jsPDF();
    const dataVencimentoFormatada = vale.dataVencimento
        ? new Date(vale.dataVencimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
        : '-';

    doc.setFontSize(18);
    doc.text(`Detalhes do Vale Processado - VP-${vale.id}`, 14, 22);

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

    doc.save(`vale-processado-${vale.id}.pdf`);
  };

  const valesFiltrados = vales.filter(vale => {
    const clienteMatch = vale.cliente.toLowerCase().includes(filtro.toLowerCase());
    const transportadoraMatch =  vale.transportadora.toLowerCase().includes(transportadoraFiltro.toLowerCase());
    return clienteMatch && transportadoraMatch;
  });

  if (loading) return <div className="p-6 text-center">Carregando vales processados...</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;

  return (
    <>
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Vales Processados</h1>
            <p className="text-green-100">Visualize e baixe os vales que já foram concluídos</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{vales.length}</div>
            <div className="text-green-200">Total de Vales Concluídos</div>
          </div>
        </div>
      </div>

      <Card className="shadow-lg border-0 bg-white p-6 grid gap-4 sm:grid-cols-2">
        <div><Label htmlFor="processados-cliente">Buscar cliente</Label><Input id="processados-cliente" value={filtro} onChange={e => setFiltro(e.target.value)} /></div>
        <div><Label htmlFor="processados-transporte">Buscar transportadora</Label><Input id="processados-transporte" value={transportadoraFiltro} onChange={e => setTransportadoraFiltro(e.target.value)} /></div>
      </Card>

      <div className="space-y-4">
        {valesFiltrados.length > 0 ? valesFiltrados.map((vale) => (
          <Card key={vale.id} className="p-6 bg-white border-l-4 border-l-blue-500"><ValeDetails vale={vale} /><Button className="mt-5" variant="outline" onClick={() => baixarPDF(vale)}>Baixar PDF</Button></Card>
        )) : (
          <p>Nenhum vale processado corresponde aos filtros.</p>
        )}
      </div>
    </div>
      </>
  );
};

export default ValesProcessados;
import ValeDetails from '@/components/ValeDetails';
// src/pages/ValesVencidos.tsx

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card/card";
import { Badge } from "@/components/ui/badge";
import  Button  from "@/components/ui/Button/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { getVales, updateValeStatus, Vale } from "@/services/api";
import { isValeOverdue, overdueDays } from '@/utils/valeDate';

interface ValePayload {
  id: string;
  transportadora: string;
  cliente: string;
  quantidade: number;
  valorUnitario: number;
  dataVencimento: string;
  dataCriacao: string;
  status: string;
  observacoes?: string;
}

interface ValeVencido extends ValePayload {
    diasVencido: number;
}

const ValesVencidos = () => {
  const navigate = useNavigate();
  const [valesVencidos, setValesVencidos] = useState<ValeVencido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [valeSelecionado, setValeSelecionado] = useState<ValeVencido | null>(null);

  useEffect(() => {
      const fetchValesVencidos = async () => {
        setLoading(true);
        setError(null);
      try {
          const response = await getVales(); // chamada da API
          const vales: Vale[] = response.data.filter(vale => isValeOverdue(vale));

          const valesVencidos: ValeVencido[] = vales.map((vale) => {
            return {
              ...vale,
              diasVencido: overdueDays(vale.dataVencimento),
              dataVencimento: vale.dataVencimento,
              dataCriacao: new Date(vale.dataCriacao).toISOString(),
            };
          });

          setValesVencidos(valesVencidos);
        } catch (e) {
          setError("Falha ao carregar os vales vencidos.");
          console.error(e);
        } finally {
          setLoading(false);
        }
      };
      fetchValesVencidos();
  }, []);

  const getBadgeColor = (dias: number) => {
    if (dias <= 3) return "bg-orange-100 text-orange-800 border-orange-300";
    if (dias <= 7) return "bg-red-100 text-red-800 border-red-300";
    return "bg-red-200 text-red-900 border-red-400";
  };

  if (loading) return <div className="p-6 text-center">Carregando vales vencidos...</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;
  const maxDiasVencido = valesVencidos.length > 0 ? Math.max(...valesVencidos.map(vale => vale.diasVencido)) : 0;

  const confirmarContato = (vale: ValeVencido) => {
  setValeSelecionado(vale);
  setOpenModal(true);
};

const darBaixaVale = async (id: string) => {
  try {
    // 1. Encontrar o vale na lista local
    const valeParaBaixar = valesVencidos.find(vale => vale.id === id);
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
    setValesVencidos(old => old.filter(vale => vale.id !== id));

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


  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Vale Paletes Vencidos</h1>
        <p className="text-gray-600">Vales que ultrapassaram o prazo de validade</p>
      </div>

      <Alert className="border-red-200 bg-red-50">
        <AlertDescription className="text-red-800">
          <strong>Atenção:</strong> Existem {valesVencidos.length} vales vencidos que precisam de ação imediata.
        </AlertDescription>
      </Alert>

      {valesVencidos.length === 0 && <p>Nenhum vale vencido.</p>}

      <div className="grid gap-4">
        {valesVencidos.map((vale) => (
          <Card key={vale.id} className="p-6 border-red-200 bg-white"><ValeDetails vale={vale} /><p className="mt-4 text-red-700">{vale.diasVencido} dias de atraso</p><Button className="mt-4" onClick={() => darBaixaVale(vale.id)}>Processar vale {vale.id}</Button></Card>
        ))}
      </div>
    </div>
  );
};

export default ValesVencidos;

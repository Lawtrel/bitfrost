// src/pages/ValesAcumulados.tsx

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useVales } from "@/hooks/useVales";
import { deleteVale, updateValeStatus } from "@/services/api";
import { toast } from "@/components/ui/use-toast";

export default function ValesAcumulados() {
  const { vales, loading, error, refetchVales } = useVales('acumulado');

  const handleDeleteVale = async (id: string) => {
    if (window.confirm("Tem certeza que deseja deletar este vale?")) {
      try {
        await deleteVale(id);
        toast({ title: "Sucesso", description: "Vale deletado." });
        refetchVales(); // Recarrega a lista
      } catch (err) {
        toast({ title: "Erro", description: "Não foi possível deletar o vale.", variant: "destructive" });
      }
    }
  };

  const handleProcessarVale = async (id: string) => {
    if (window.confirm("Tem certeza que deseja marcar este vale como 'processado'?")) {
      try {
        await updateValeStatus(id, 'processado');
        toast({ title: "Sucesso", description: "Vale processado." });
        refetchVales(); // Recarrega a lista
      } catch (err) {
        toast({ title: "Erro", description: "Não foi possível processar o vale.", variant: "destructive" });
      }
    }
  };

  if (loading) return <div>Carregando vales...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Vales Acumulados</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Transportadora</TableHead>
            <TableHead>Quantidade</TableHead>
            <TableHead>Valor Unitário</TableHead>
            <TableHead>Data de Vencimento</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vales.map((vale) => (
            <TableRow key={vale.id}>
              <TableCell>{vale.cliente}</TableCell>
              <TableCell>{vale.transportadora}</TableCell>
              <TableCell>{vale.quantidade}</TableCell>
              <TableCell>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(vale.valorUnitario)}</TableCell>
              <TableCell>{new Date(vale.dataVencimento).toLocaleDateString('pt-BR')}</TableCell>
              <TableCell className="space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleProcessarVale(vale.id)}>
                  Processar
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteVale(vale.id)}>
                  Deletar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
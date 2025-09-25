// src/pages/ValesVencidos.tsx

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useVales } from "@/hooks/useVales";

export default function ValesVencidos() {
  const { vales, loading, error } = useVales('vencido');

  if (loading) return <div>Carregando vales...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Vales Vencidos</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Transportadora</TableHead>
            <TableHead>Quantidade</TableHead>
            <TableHead>Data de Vencimento</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vales.map((vale) => (
            <TableRow key={vale.id} className="bg-red-100">
              <TableCell>{vale.cliente}</TableCell>
              <TableCell>{vale.transportadora}</TableCell>
              <TableCell>{vale.quantidade}</TableCell>
              <TableCell>{new Date(vale.dataVencimento).toLocaleDateString('pt-BR')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
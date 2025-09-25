// src/pages/Dashboard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useVales } from "@/hooks/useVales";

export default function Dashboard() {
  // Usamos o hook sem filtro para pegar todos os vales
  const { vales, loading, error } = useVales();

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar dados.</div>;

  const totalAcumulado = vales.filter(v => v.status === 'acumulado').length;
  const totalProcessado = vales.filter(v => v.status === 'processado').length;
  const totalVencido = vales.filter(v => v.status === 'vencido').length;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Vales Acumulados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalAcumulado}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Vales Processados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalProcessado}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Vales Vencidos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalVencido}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
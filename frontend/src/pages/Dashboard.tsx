import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card/card';
import { getClientes, getTransportadoras, getVales, type Vale } from '@/services/api';

export default function Dashboard() {
  const [vales, setVales] = useState<Vale[]>([]);
  const [clientes, setClientes] = useState(0);
  const [transportadoras, setTransportadoras] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    Promise.all([getVales(), getClientes(), getTransportadoras()]).then(([v,c,t]) => {
      if (!active) return;
      setVales(v.data); setClientes(c.data.length); setTransportadoras(t.data.length);
    }).catch(() => { if (active) setError(true); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  if (loading) return <p role="status" className="p-6">Carregando dados...</p>;
  if (error) return <p role="alert" className="p-6 text-red-700">Não foi possível carregar o painel. Recarregue a página para tentar novamente.</p>;
  const processados = vales.filter(v => v.status === 'processado');
  const abertos = vales.filter(v => v.status === 'acumulado');
  const vencidos = vales.filter(v => v.status === 'vencido' || (v.status === 'acumulado' && new Date(v.dataVencimento).getTime() < Date.now()));
  const valor = processados.reduce((total,v) => total + v.quantidade * v.valorUnitario, 0);
  const taxa = vales.length ? (processados.length / vales.length * 100).toFixed(1) : '0.0';
  const metrics = [['Vales em aberto', abertos.length], ['Vales vencidos', vencidos.length], ['Vales processados', processados.length], ['Total de vales', vales.length]];
  return <div className="p-6 space-y-6 min-h-screen bg-slate-50">
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 text-white"><h1 className="text-3xl font-bold">Visão geral dos vales</h1><p className="mt-2">Indicadores dos registros cadastrados no sistema</p></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(([label,value]) => <Card key={label} className="p-6 bg-white"><h2 className="text-sm text-gray-600">{label}</h2><p className="text-3xl font-semibold mt-2">{value}</p></Card>)}</div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <Card className="p-6 bg-white"><h2>Taxa de processamento</h2><p className="text-2xl font-bold mt-2">{taxa}%</p></Card>
      <Card className="p-6 bg-white"><h2>Valor dos vales processados</h2><p className="text-2xl font-bold mt-2">{valor.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</p></Card>
      <Card className="p-6 bg-white"><h2>Parceiros cadastrados</h2><p className="mt-2">{clientes} clientes · {transportadoras} transportadoras</p></Card>
    </div>
    <p className="text-sm text-gray-600">Os indicadores incluem todos os registros. Um vale em aberto pode também estar vencido.</p>
  </div>;
}

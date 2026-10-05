import type { Vale } from '@/services/api';
export default function ValeDetails({ vale }: { vale: Pick<Vale, 'id' | 'cliente' | 'transportadora' | 'quantidade' | 'valorUnitario' | 'dataVencimento' | 'observacoes'> }) {
  const currency = (value: number) => value.toLocaleString('pt-BR', {style:'currency',currency:'BRL'});
  return <dl className="grid gap-3 sm:grid-cols-2 text-sm">
    <div><dt className="font-semibold">Cliente</dt><dd>{vale.cliente}</dd></div>
    <div><dt className="font-semibold">Transportadora</dt><dd>{vale.transportadora}</dd></div>
    <div><dt className="font-semibold">Quantidade</dt><dd>{vale.quantidade} paletes</dd></div>
    <div><dt className="font-semibold">Vencimento</dt><dd>{new Date(vale.dataVencimento).toLocaleDateString('pt-BR',{timeZone:'UTC'})}</dd></div>
    <div><dt className="font-semibold">Valor unitário</dt><dd>{currency(vale.valorUnitario)}</dd></div>
    <div><dt className="font-semibold">Valor total</dt><dd>{currency(vale.quantidade * vale.valorUnitario)}</dd></div>
    <div className="sm:col-span-2"><dt className="font-semibold">Identificação</dt><dd className="break-all">{vale.id}</dd></div>
    {vale.observacoes && <div className="sm:col-span-2"><dt className="font-semibold">Observações</dt><dd>{vale.observacoes}</dd></div>}
  </dl>;
}

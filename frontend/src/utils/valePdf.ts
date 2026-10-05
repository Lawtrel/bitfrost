import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface PdfVale {
  id?: string;
  cliente: string;
  transportadora: string;
  quantidade: number;
  valorUnitario: number;
  dataVencimento: string;
  observacoes?: string;
  status?: string;
}

export function createValePdf(vale: PdfVale, title = 'Vale palete') {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  const currency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const date = new Date(vale.dataVencimento);
  autoTable(doc, {
    startY: 30,
    head: [['Campo', 'Valor']],
    body: [
      ['Identificação', vale.id || 'Prévia sem emissão'],
      ['Cliente', vale.cliente || '-'],
      ['Transportadora', vale.transportadora || '-'],
      ['Quantidade', `${vale.quantidade} paletes`],
      ['Valor unitário', currency(vale.valorUnitario)],
      ['Valor total', currency(vale.quantidade * vale.valorUnitario)],
      ['Vencimento', Number.isFinite(date.getTime()) ? date.toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '-'],
      ['Status', vale.status || 'Prévia'],
      ['Observações', vale.observacoes || '-'],
    ],
    theme: 'striped',
    margin: 14,
    columnStyles: { 0: { cellWidth: 42 } },
    styles: { overflow: 'linebreak', fontSize: 10, cellPadding: 4 },
  });
  return doc;
}

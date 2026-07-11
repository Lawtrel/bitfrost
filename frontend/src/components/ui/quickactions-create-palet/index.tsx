import { Card } from "@/components/ui/card/card";
import  Button  from "@/components/ui/button/button";
import { Download, Send } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface AcoesRapidasProps {
  clientePreenchido: boolean;
  formData: {
    cliente: string;
    transportadora: string;
    quantidade: string;
    dataVencimento: string;
    observacoes: string;
    valorUnitario: string;
  };
}

export function AcoesRapidas({ clientePreenchido, formData }: AcoesRapidasProps) {

  // --- FUNÇÃO PARA GERAR PDF ADICIONADA ---
  const gerarPDF = () => {
    if (!clientePreenchido) return;

    const doc = new jsPDF();
    const dataVencimentoFormatada = formData.dataVencimento 
        ? new Date(formData.dataVencimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) 
        : '-';

    doc.setFontSize(18);
    doc.text("Preview do Vale Palete", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);

    autoTable(doc, {
      startY: 30,
      head: [["Campo", "Valor"]],
      body: [
        ["Cliente", formData.cliente || "-"],
        ["Transportadora", formData.transportadora || "-"],
        ["Quantidade", `${formData.quantidade || 0} paletes`],
        ["Valor Unitário", `R$ ${parseFloat(formData.valorUnitario || '0').toFixed(2)}`],
        ["Data de Vencimento", dataVencimentoFormatada],
        ["Observações", formData.observacoes || "-"]
      ],
      theme: 'striped'
    });

    doc.save(`vale-palete-${formData.cliente}.pdf`);
  };

  return (
    <Card className="shadow-lg border-0">
      
    </Card>
  );
}
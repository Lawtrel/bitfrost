import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
      <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
        <CardTitle className="flex items-center gap-2 text-gray-800">
          ⚡ Ações Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-3">
        {/* Botão de PDF agora chama a função gerarPDF */}
        <Button
          variant="outline"
          className="w-full justify-start h-10"
          disabled={!clientePreenchido}
          onClick={gerarPDF}
        >
          <Download className="w-4 h-4 mr-2" />
          Baixar Preview PDF
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start h-10"
          disabled={!clientePreenchido}
        >
          <Send className="w-4 h-4 mr-2" />
          <a href="https://mail.google.com/mail/?view=cm&fs=1&to=exemplo@email.com&su=Contato%20do%20site&body=Olá,%20quero%20saber%20mais..."
            target="_blank" 
            rel="noopener noreferrer">
            📧 Enviar email ao cliente
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
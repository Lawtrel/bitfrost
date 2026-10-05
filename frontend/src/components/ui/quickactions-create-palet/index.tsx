import { createValePdf } from '@/utils/valePdf';
import { Card } from "@/components/ui/card/card";
import  Button  from "@/components/ui/Button/button";
import { Download, Send } from "lucide-react";

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

    createValePdf({ ...formData, quantidade: Number(formData.quantidade), valorUnitario: Number(formData.valorUnitario) }, 'Prévia do vale palete').save('previa-vale-palete.pdf');
  };

  return (
    <Card className="shadow-lg border-0 bg-white p-6"><Button type="button" variant="outline" disabled={!clientePreenchido} onClick={gerarPDF}>Baixar prévia em PDF</Button></Card>
  );
}
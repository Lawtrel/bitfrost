// src/components/ui/preview-vale.tsx

import { Card } from "@/components/ui/card/card";
import { FileText } from "lucide-react";

interface PreviewValeProps {
    cliente: string;
    transportadora: string;
    quantidade: string;
    dataVencimento: string;
    valorUnitario: string;
    observacoes?: string;
}

export function PreviewVale({
    cliente,
    transportadora,
    quantidade,
    dataVencimento,
    valorUnitario,
    observacoes,
}: PreviewValeProps) {
    const calcularValorTotal = () => {
        const qtd = parseInt(quantidade) || 0;
        const valor = parseFloat(valorUnitario) || 0;
        return (qtd * valor).toFixed(2).replace(".", ",");
    };

    const hasData = cliente && transportadora;

    return (
        <Card className="shadow-lg border-0 bg-white p-6">
          <h2 className="font-semibold mb-4">Prévia do vale</h2>
          {hasData ? <dl className="space-y-2 text-sm">
            <div><dt className="font-semibold">Cliente</dt><dd>{cliente}</dd></div>
            <div><dt className="font-semibold">Transportadora</dt><dd>{transportadora}</dd></div>
            <div><dt className="font-semibold">Paletes</dt><dd>{quantidade}</dd></div>
            <div><dt className="font-semibold">Vencimento</dt><dd>{dataVencimento ? dataVencimento.split('-').reverse().join('/') : 'Não informado'}</dd></div>
            <div><dt className="font-semibold">Valor total</dt><dd>R$ {calcularValorTotal()}</dd></div>
            {observacoes && <div><dt className="font-semibold">Observações</dt><dd>{observacoes}</dd></div>}
          </dl> : <p className="text-sm text-gray-600">Selecione cliente e transportadora para visualizar.</p>}
        </Card>
    );
}

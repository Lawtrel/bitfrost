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
        <Card className="shadow-lg border-0">
        </Card>
    );
}

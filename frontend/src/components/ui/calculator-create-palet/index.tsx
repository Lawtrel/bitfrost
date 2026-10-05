
import { Card } from "@/components/ui/card/card";
import { Calculator } from "lucide-react";

    interface ResumoFinanceiroProps {
    quantidade: string;
    valorUnitario: string;
    }

export function ResumoFinanceiro({ quantidade, valorUnitario }: ResumoFinanceiroProps) {
    const total = () => {
        const qtd = parseInt(quantidade) || 0;
        const valor = parseFloat(valorUnitario) || 0;
        return (qtd * valor).toFixed(2).replace(".", ",");
    };

    return (
        <Card className="shadow-lg border-0 bg-white p-6">
          <h2 className="font-semibold mb-4">Resumo financeiro</h2>
          <p>{quantidade || '0'} paletes × R$ {valorUnitario || '0'}</p>
          <p className="text-2xl font-bold mt-3">R$ {total()}</p>
        </Card>
    );
}

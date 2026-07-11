
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
        <Card className="shadow-lg border-0">
        </Card>
    );
}

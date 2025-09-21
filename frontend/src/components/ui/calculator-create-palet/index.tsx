
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
            <CardTitle className="flex items-center gap-2 text-gray-800">
            <Calculator className="h-5 w-5 text-green-600" />
            Resumo Financeiro
            </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">Quantidade:</span>
            <span className="font-semibold">{quantidade || 0} paletes</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">Valor unitário:</span>
            <span className="font-semibold">R$ {valorUnitario || "0,00"}</span>
            </div>
            <div className="flex justify-between items-center py-3 bg-green-50 px-3 rounded-lg">
            <span className="font-semibold text-green-800">Valor Total:</span>
            <span className="text-xl font-bold text-green-600">R$ {total()}</span>
            </div>
        </CardContent>
        </Card>
    );
}

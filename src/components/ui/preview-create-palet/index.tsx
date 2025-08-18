// src/components/ui/preview-vale.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
            <CardTitle className="flex items-center gap-2 text-gray-800">
            <FileText className="h-5 w-5 text-blue-600" />
            Preview do Vale
            </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
            {hasData ? (
            <div className="space-y-3 text-sm">
                <div className="text-center border-b pb-3 mb-4">
                <h3 className="font-bold text-lg">VALE PALETE DIGITAL</h3>
                </div>

                <div><strong>Cliente:</strong> {cliente}</div>
                <div><strong>Transportadora:</strong> {transportadora}</div>
                <div><strong>Quantidade:</strong> {quantidade} paletes</div>
                <div><strong>Vencimento:</strong> {dataVencimento}</div>
                <div><strong>Valor:</strong> R$ {calcularValorTotal()}</div>

                {observacoes && (
                <div className="pt-2 border-t">
                    <strong>Obs:</strong> {observacoes}
                </div>
                )}
            </div>
            ) : (
            <div className="text-center text-gray-500 py-8">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Preencha os dados para visualizar o preview</p>
            </div>
            )}
        </CardContent>
        </Card>
    );
}

import { CalculateRoiResult } from "@/utils/calculateRoi";
import RoiAnalysis from "./roiAnalisys";
import RoiMetricCard from "./roiMetricCard";

interface RoiResultProps { result: CalculateRoiResult; } 
export default function RoiResult({ result }: RoiResultProps) { 
    return ( 
        <aside data-testid="roi-result" className="flex flex-col gap-8 w-[650px] h-[850px] rounded-3xl border bg-card p-8 shadow-lg" > 
            <div className="flex flex-col gap-2"> 
                <h3 className="font-inter text-3xl font-bold"> Resultado da Simulação </h3> 
                <p className="text-muted-foreground"> Estes valores representam uma estimativa baseada nas informações fornecidas. </p> 
            </div>
            <div className="grid grid-cols-2 gap-6">
                <RoiMetricCard
                    title="Prejuízo dos Pallets"
                    value={result.totalPalletLossCost.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    })}
                    valueClassName="text-red-500"
                />

                <RoiMetricCard
                    title="Prejuízo dos Vales"
                    value={result.totalVoucherLossCosts.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    })}
                    valueClassName="text-red-500"
                />

                <RoiMetricCard
                    title="Prejuízo Total"
                    value={result.totalLossCost.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    })}
                    valueClassName="text-red-500"
                />

                <RoiMetricCard
                    title="Prejuízo com Vale Pallet"
                    value={result.totalLossCostWithValePallet.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    })}
                    valueClassName="text-green-600"
                />

                <RoiMetricCard
                    title="Economia Total"
                    value={result.totalSavings.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    })}
                    valueClassName="text-indigo-600"
                />

                <RoiMetricCard
                    title="Investimento"
                    value={result.totalInvestment.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    })}
                />

                <RoiMetricCard
                    title="Payback"
                    value={`${result.paybackMonths.toFixed(1)} meses`}
                />

                <RoiMetricCard
                    title="ROI"
                    value={`${result.roi.toFixed(0)}%`}
                    valueClassName="text-emerald-600"
                />
            </div>

            <RoiAnalysis recommendation={result.recommendation} />
        </aside> 
    ); 
}
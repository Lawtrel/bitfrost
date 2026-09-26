import { useState } from "react";
import RoiCalculatorForm from "./roiCalculatorForm/roiCalculatorForm";
import RoiResult from "./roiCalculatorResult/roiResult";
import { RoiCalculatorSchema } from "./roiCalculatorForm/roiCalculatorSchema";
import { calculateRoi, CalculateRoiResult } from "@/utils/calculateRoi";

export default function RoiCalculator () {
    const [result, setResult] = useState<CalculateRoiResult | null>(null);

    function handleCalculate(data: RoiCalculatorSchema) {
        const roi = calculateRoi(data);
        setResult(roi);
    }
    return (
        <section data-testid="roi-calculator" className="flex flex-col items-center justify-center w-full py-24 gap-16">
            <div className="flex flex-col items-center gap-6">
                <span className="font-inter text-indigo-500 font-semibold uppercase tracking-[0.25rem]">
                    Simulador Financeiro
                </span>
                <h2 className="font-inter text-white text-5xl font-bold text-center">
                    Calcule o Retorno sobre Investimento (ROI)
                </h2>
                <p className="font-inter text-center text-gray-400 text-xl max-w-[900px]">
                    Informe alguns dados da sua operação e descubra quanto sua
                    empresa pode economizar utilizando o ecossistema Vale
                    Pallet.
                </p>
            </div>
            <div className="flex-col items-center p-8 justify-center flex border border-cyan-500/10 shadow-md rounded-3xl bg-gradient-to-b from-[#0F1523] to-[#0A0E18] w-[90%] gap-12 ">
                <div className="flex gap-12 pt-8">
                    <RoiCalculatorForm  onSubmit={handleCalculate}  />
                    {result && (
                        <RoiResult result={result} />
                    )}
                </div>
                <p className="text-white pb-8 w-[850px] text-center">
                    Os cálculos foram realizados considerando uma perda de 5% dos vales pallets atualmente para uma perda por 1% dos vales conosco devido a erros humanos, além de um tempo de desenvolvimento de 18 meses. Os valores e o tempo podem diferir a depeder do nível de suas operações.
                </p>
            </div>
        </section>
    )
}
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import RoiCalculator from "./roiCalculator";

vi.mock("./roiCalculatorForm/roiCalculatorForm", () => ({
    default: ({
        onSubmit,
    }: {
        onSubmit: (data: unknown) => void;
    }) => (
        <button
            data-testid="mock-form"
            onClick={() =>
                onSubmit({
                    companyName: "Empresa Teste",
                    vouchersPerYear: 100000,
                    vouchersCosts: 8,
                    palletsPerTruck: 26,
                    palletsCosts: 50,
                    service: "both",
                    years: 5,
                })
            }
        >
            Calcular ROI
        </button>
    ),
}));

vi.mock("./roiCalculatorResult/roiResult", () => ({
    default: ({
        result,
    }: {
        result: {
            totalSavings: number;
            roi: number;
        };
    }) => (
        <div data-testid="roi-result">
            <span>{result.totalSavings}</span>
            <span>{result.roi}</span>
        </div>
    ),
}));

vi.mock("@/utils/calculateRoi", () => ({
    calculateRoi: vi.fn(() => ({
        totalPalletLossCost: 1000,
        totalVoucherLossCosts: 2000,
        totalLossCost: 3000,
        totalLossCostWithValePallet: 100,
        totalSavings: 2900,
        totalInvestment: 5000,
        paybackMonths: 12,
        roi: 50,
        recommendation:
            "O investimento tende a compensar ao longo do tempo.",
    })),
}));

describe("RoiCalculator", () => {
    it("Deve renderizar corretamente o componente principal", () => {
        render(<RoiCalculator />);

        expect(
            screen.getByTestId("roi-calculator")
        ).toBeInTheDocument();
    });


    it("Deve renderizar o título e descrição da calculadora", () => {
        render(<RoiCalculator />);

        expect(
            screen.getByText(
                /calcule o retorno sobre investimento \(roi\)/i
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                /informe alguns dados da sua operação/i
            )
        ).toBeInTheDocument();
    });


    it("Deve renderizar o formulário de cálculo", () => {
        render(<RoiCalculator />);

        expect(
            screen.getByTestId("mock-form")
        ).toBeInTheDocument();
    });


    it("Não deve renderizar o resultado inicialmente", () => {
        render(<RoiCalculator />);

        expect(
            screen.queryByTestId("roi-result")
        ).not.toBeInTheDocument();
    });


    it("Deve calcular e exibir o resultado após envio do formulário", async () => {
        const user = userEvent.setup();

        render(<RoiCalculator />);

        await user.click(
            screen.getByTestId("mock-form")
        );

        expect(
            screen.getByTestId("roi-result")
        ).toBeInTheDocument();
    });


    it("Deve enviar os dados do formulário para a função calculateRoi", async () => {
        const user = userEvent.setup();

        const { calculateRoi } = await import("@/utils/calculateRoi");

        render(<RoiCalculator />);

        await user.click(
            screen.getByTestId("mock-form")
        );

        expect(calculateRoi).toHaveBeenCalledTimes(2);

        expect(calculateRoi).toHaveBeenCalledWith({
            companyName: "Empresa Teste",
            vouchersPerYear: 100000,
            vouchersCosts: 8,
            palletsPerTruck: 26,
            palletsCosts: 50,
            service: "both",
            years: 5,
        });
    });


    it("Deve renderizar o resultado com os dados calculados", async () => {
        const user = userEvent.setup();

        render(<RoiCalculator />);

        await user.click(
            screen.getByTestId("mock-form")
        );

        expect(
            screen.getByText("2900")
        ).toBeInTheDocument();

        expect(
            screen.getByText("50")
        ).toBeInTheDocument();
    });


    it("Deve renderizar a observação final da calculadora", () => {
        render(<RoiCalculator />);

        expect(
            screen.getByText(
                /os cálculos foram realizados considerando/i
            )
        ).toBeInTheDocument();
    });
});
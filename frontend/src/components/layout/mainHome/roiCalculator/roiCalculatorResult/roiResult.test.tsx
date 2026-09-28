import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import RoiResult from "./roiResult";
import { CalculateRoiResult } from "@/utils/calculateRoi";

vi.mock("./roiMetricCard", () => ({
    default: ({
        title,
        value,
    }: {
        title: string;
        value: string;
    }) => (
        <div data-testid="roi-metric-card">
            <span>{title}</span>
            <span>{value}</span>
        </div>
    ),
}));

vi.mock("./roiAnalisys", () => ({
    default: ({
        recommendation,
    }: {
        recommendation: string;
    }) => (
        <div data-testid="roi-analysis">
            {recommendation}
        </div>
    ),
}));

describe("RoiResult", () => {
    const mockResult: CalculateRoiResult = {
        totalPalletLossCost: 50000,
        totalVoucherLossCosts: 20000,
        totalLossCost: 70000,
        totalLossCostWithValePallet: 5000,
        totalSavings: 65000,
        totalInvestment: 100000,
        implementationCost: 80000,
        maintenanceCost: 20000,
        paybackMonths: 18.5,
        roi: 250,
        recommendation: "Excelente investimento.",
    };

    it("Deve renderizar o componente corretamente", () => {
        render(
            <RoiResult result={mockResult} />
        );

        expect(
            screen.getByTestId("roi-result")
        ).toBeInTheDocument();
    });


    it("Deve renderizar o título e descrição da simulação", () => {
        render(
            <RoiResult result={mockResult} />
        );

        expect(
            screen.getByRole("heading", {
                name: /resultado da simulação/i,
            })
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                /estes valores representam uma estimativa baseada nas informações fornecidas/i
            )
        ).toBeInTheDocument();
    });


    it("Deve renderizar todos os cards de métricas", () => {
        render(
            <RoiResult result={mockResult} />
        );

        expect(
            screen.getAllByTestId("roi-metric-card")
        ).toHaveLength(8);
    });


    it("Deve exibir corretamente os valores formatados das métricas", () => {
        render(
            <RoiResult result={mockResult} />
        );

        expect(
            screen.getByText("R$ 50.000,00")
        ).toBeInTheDocument();

        expect(
            screen.getByText("R$ 20.000,00")
        ).toBeInTheDocument();

        expect(
            screen.getByText("R$ 70.000,00")
        ).toBeInTheDocument();

        expect(
            screen.getByText("R$ 5.000,00")
        ).toBeInTheDocument();

        expect(
            screen.getByText("R$ 65.000,00")
        ).toBeInTheDocument();

        expect(
            screen.getByText("R$ 100.000,00")
        ).toBeInTheDocument();

        expect(
            screen.getByText("18.5 meses")
        ).toBeInTheDocument();

        expect(
            screen.getByText("250%")
        ).toBeInTheDocument();
    });


    it("Deve renderizar a análise com a recomendação recebida", () => {
        render(
            <RoiResult result={mockResult} />
        );

        expect(
            screen.getByTestId("roi-analysis")
        ).toHaveTextContent(
            "Excelente investimento."
        );
    });


    it("Deve enviar corretamente os dados para os componentes filhos", () => {
        render(
            <RoiResult result={mockResult} />
        );

        const metrics = screen.getAllByTestId(
            "roi-metric-card"
        );

        expect(metrics[0]).toHaveTextContent(
            "Prejuízo dos Pallets"
        );

        expect(metrics[1]).toHaveTextContent(
            "Prejuízo dos Vales"
        );

        expect(metrics[2]).toHaveTextContent(
            "Prejuízo Total"
        );

        expect(metrics[3]).toHaveTextContent(
            "Prejuízo com Vale Pallet"
        );

        expect(metrics[4]).toHaveTextContent(
            "Economia Total"
        );

        expect(metrics[5]).toHaveTextContent(
            "Investimento"
        );

        expect(metrics[6]).toHaveTextContent(
            "Payback"
        );

        expect(metrics[7]).toHaveTextContent(
            "ROI"
        );
    });
});

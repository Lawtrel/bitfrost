import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import RoiMetricCard from "./roiMetricCard";

describe("RoiMetricCard", () => {
    it("Deve renderizar o título corretamente", () => {
        render(
            <RoiMetricCard
                title="Economia Total"
                value="R$ 100.000,00"
            />
        );

        expect(
            screen.getByText("Economia Total")
        ).toBeInTheDocument();
    });


    it("Deve renderizar o valor corretamente", () => {
        render(
            <RoiMetricCard
                title="Investimento"
                value="R$ 50.000,00"
            />
        );

        expect(
            screen.getByText("R$ 50.000,00")
        ).toBeInTheDocument();
    });


    it("Deve aplicar a classe personalizada no valor quando informada", () => {
        render(
            <RoiMetricCard
                title="ROI"
                value="300%"
                valueClassName="text-emerald-600"
            />
        );

        const value = screen.getByText("300%");

        expect(value).toHaveClass("text-emerald-600");
    });


    it("Não deve aplicar classe personalizada quando não informada", () => {
        render(
            <RoiMetricCard
                title="Payback"
                value="12 meses"
            />
        );

        const value = screen.getByText("12 meses");

        expect(value).not.toHaveClass("text-emerald-600");
        expect(value).not.toHaveClass("text-red-500");
        expect(value).not.toHaveClass("text-indigo-600");
    });


    it("Deve renderizar múltiplos cards independentes corretamente", () => {
        render(
            <>
                <RoiMetricCard
                    title="Economia Total"
                    value="R$ 100.000,00"
                />

                <RoiMetricCard
                    title="Investimento"
                    value="R$ 50.000,00"
                />
            </>
        );

        expect(
            screen.getByText("Economia Total")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Investimento")
        ).toBeInTheDocument();

        expect(
            screen.getByText("R$ 100.000,00")
        ).toBeInTheDocument();

        expect(
            screen.getByText("R$ 50.000,00")
        ).toBeInTheDocument();
    });
});
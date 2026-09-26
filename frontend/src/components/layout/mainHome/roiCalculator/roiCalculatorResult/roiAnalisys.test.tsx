import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import RoiAnalysis from "./roiAnalisys";

describe("RoiAnalysis", () => {
    it("Deve renderizar o título da análise corretamente", () => {
        render(
            <RoiAnalysis
                recommendation="O investimento apresenta ótimo retorno financeiro."
            />
        );

        expect(
            screen.getByText("Nossa análise")
        ).toBeInTheDocument();
    });


    it("Deve renderizar a recomendação recebida via props", () => {
        render(
            <RoiAnalysis
                recommendation="O investimento apresenta ótimo retorno financeiro."
            />
        );

        expect(
            screen.getByText(
                "O investimento apresenta ótimo retorno financeiro."
            )
        ).toBeInTheDocument();
    });


    it("Deve renderizar recomendações diferentes corretamente", () => {
        render(
            <RoiAnalysis
                recommendation="Excelente investimento. O retorno financeiro é muito elevado."
            />
        );

        expect(
            screen.getByText(
                "Excelente investimento. O retorno financeiro é muito elevado."
            )
        ).toBeInTheDocument();
    });


    it("Deve renderizar mesmo recebendo uma recomendação vazia", () => {
        render(
            <RoiAnalysis
                recommendation=""
            />
        );

        expect(
            screen.getByText("Nossa análise")
        ).toBeInTheDocument();
    });
});
import { queryByRole, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card } from "./card";
import { createRef } from "react";

describe("Card", () => {
    it("Deve renderizar o componente corretamente", () => {
        render(
            <Card />
        )

        const card = screen.getByTestId("card");

        expect(card).toBeInTheDocument();
    })

    it("Deve renderizar os componentes filhos corretamente", () => {
    render(
        <Card>Teste</Card>
    );

    const card = screen.getByTestId("card");

    expect(card).toHaveTextContent("Teste");
    });

    it("Deve aceitar classes personalizadas e renderizar classes padrões", () => {
        render(
            <Card className="custom-class" />
        )

        const card = screen.getByTestId("card");

        expect(card).toHaveClass("custom-class", "rounded-lg");
    });

    it("Deve renderizar o header se o título existir", () => {
        render(
            <Card cardTitle="Title" />
        )

        const cardHeader = screen.getByTestId("card-header");

        expect(cardHeader).toBeInTheDocument();
    });

    it("Deve renderizar o header se o ícone existir", () => {
        render(
            <Card cardIcon="Icon" />
        )

        const cardHeader = screen.getByTestId("card-header");

        expect(cardHeader).toBeInTheDocument();
    });

    it("Deve renderizar o header se a descrição existir", () => {
        render(
            <Card cardDescription="Description" />
        )

        const cardHeader = screen.getByTestId("card-header");

        expect(cardHeader).toBeInTheDocument();
    });

    it("Não deve renderizar o header se nenhum dos elementos do mesmo não existir", () => {
        render(
            <Card />
        )

        const cardHeader = screen.queryByTestId("card-header");

        expect(cardHeader).not.toBeInTheDocument();
    });

    it("O header deve aceitar classes padrões e classes personalizadas", () => {
        render(
            <Card headerClassName="custom-class" cardTitle="Title"/>
        )

        const cardHeader = screen.getByTestId("card-header");

        expect(cardHeader).toHaveClass("custom-class", "flex");
    });

    it("O ícone deve ser renderizado se for chamado", () => {
        render(
            <Card cardIcon="Icon" />
        )

        const cardIcon = screen.getByText("Icon");

        expect(cardIcon).toBeInTheDocument();
    });

    it("O ícone deve permitir classes personalizadas e manter a classe padrão", () => {
        render(
            <Card cardIcon="Icon" iconClassName="custom-class" />
        )

        const cardIcon = screen.getByText("Icon");

        expect(cardIcon).toHaveClass("custom-class", "rounded-lg");
    });

    it("O título deve ser renderizado se for chamado", () => {
        render(
            <Card cardTitle="Title" />
        )

        const cardTitle = screen.getByText("Title");

        expect(cardTitle).toBeInTheDocument();
    });

    it("O título deve permitir classes personalizadas e manter a classe padrão", () => {
        render(
            <Card cardTitle="Title" titleClassName="custom-class" />
        )

        const cardTitle = screen.getByText("Title");

        expect(cardTitle).toHaveClass("custom-class", "text-2xl");
    });

    it("A descrição deve ser renderizada se for chamada", () => {
        render(
            <Card cardDescription="Description" />
        )

        const cardDescription = screen.getByText("Description");

        expect(cardDescription).toBeInTheDocument();
    });

    it("A descrição deve permitir classes personalizadas e manter a classe padrão", () => {
        render(
            <Card cardDescription="Description" descriptionClassName="custom-class" />
        )

        const cardDescription = screen.getByText("Description");

        expect(cardDescription).toHaveClass("custom-class", "text-md");
    });

    it("O footer deve ser renderizada se for chamada", () => {
        render(
            <Card cardFooter="Footer" />
        )

        const cardFooter = screen.getByText("Footer");

        expect(cardFooter).toBeInTheDocument();
    });

    it("O footer deve permitir classes personalizadas e manter a classe padrão", () => {
        render(
            <Card cardFooter="Footer" footerClassName="custom-class" />
        )

        const cardFooter = screen.getByText("Footer");

        expect(cardFooter).toHaveClass("custom-class", "flex");
    });

    it("Não deve renderizar o footer se nenhum dos elementos do mesmo não existir", () => {
        render(
            <Card />
        )

        const cardFooter = screen.queryByTestId("card-footer");

        expect(cardFooter).not.toBeInTheDocument();
    });

    it("Deve enviar as referências para os elementos adiante", () => {
        const ref = createRef<HTMLDivElement>();

        render(
            <Card ref={ref} />
        )

        expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("Deve enviar as props para os elementos adiante", () => {
        render(
            <Card aria-label="Meu Card" id="card-id" />
        )

        const card =  screen.getByTestId("card");

        expect(card).toHaveAttribute("id", "card-id");
        expect(card).toHaveAttribute("aria-label", "Meu Card");
    })
});
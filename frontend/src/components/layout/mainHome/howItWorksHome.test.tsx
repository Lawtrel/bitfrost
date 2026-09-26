import { CardProps } from "@/components/ui/card/card";
import { fireEvent, render, screen } from "@testing-library/react";
import { vi, describe } from "vitest";
import HowItWorksHome from "./howItWorksHome";
import { howItWorksList } from "./howItWorksHomeList";

// Para saber quais os nomes dos testes a serem executados screen.logTestingPlaygroundURL();

vi.mock("@/components/ui/card/card", () => ({
    Card: ({cardIcon}: Pick<CardProps, "cardIcon">) => <div data-testid="card">{cardIcon}</div>,
}));


describe("howItWorksHome", () => {
    it("Deve renderizar o componente e o título coretamente", () => {
        render(
            <HowItWorksHome />
        )
        const howItWorks = screen.getByRole("heading", { name: /como funciona o ecossistema/i })

        expect(howItWorks).toBeInTheDocument();
    });

    it("Deve renderizar a descrição da seção", () => {
        render(<HowItWorksHome />);

        expect(
            screen.getByText(
                /cinco etapas fluidas para transformar sua logística/i
            )
        ).toBeInTheDocument();
    });

    it("Deve renderizar o card corretamente, a quantidade de cards informadas e os ícones de cada card", () => {
        render(
            <HowItWorksHome />
        )

        const card = screen.getAllByTestId("card")

        expect(card).toHaveLength(howItWorksList.length);
    });

    it("Deve renderizar a quantidade correta de conectores entre os cards e não deve renderizar um conector após o último card", () => {
        render(<HowItWorksHome />);

        expect(screen.getAllByTestId("connector")).toHaveLength(
            howItWorksList.length - 1
        );
    });

    it("Deve destacar os conectores ao passar o mouse sobre um passo", () => {
        render(<HowItWorksHome />);

        const cards = screen.getAllByTestId("card");

        fireEvent.mouseEnter(cards[2]);

        const connectors = screen.getAllByTestId("connector");

        expect(connectors[0]).toHaveClass("border-blue-400");
        expect(connectors[1]).toHaveClass("border-blue-400");
    });

    it("Deve remover o destaque dos conectores ao retirar o mouse", () => {
        render(<HowItWorksHome />);

        const cards = screen.getAllByTestId("card");

        fireEvent.mouseEnter(cards[2]);
        fireEvent.mouseLeave(cards[2]);

        screen.getAllByTestId("connector").forEach((connector) => {
            expect(connector).toHaveClass("border-gray-300");
        });
    });

})
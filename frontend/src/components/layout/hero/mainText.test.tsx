import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import MainText from "./mainText";

vi.mock("@/components/shared/animatedText/animatedText", () => ({
    default: ({ items }: { items: string[] }) => (
        <span data-testid="animated-text">{items[0]}</span>
    ),
}));

function renderWithRouter(component: React.ReactNode) {
    return render(
        <MemoryRouter>
            {component}
        </MemoryRouter>
    );
}

describe("MainText", () => {
    it("Deve renderizar corretamente", () => {
        renderWithRouter(<MainText />);

        expect(screen.getByRole("region")).toBeInTheDocument();
    });

    it("Deve renderizar o título principal", () => {
        renderWithRouter(<MainText />);

        expect(
            screen.getByRole("heading", {
                level: 2,
                name: /gestão inteligente de pallets e documentos/i,
            })
        ).toBeInTheDocument();
    });

    it("Deve renderizar o AnimatedText", () => {
        renderWithRouter(<MainText />);

        expect(screen.getByTestId("animated-text")).toBeInTheDocument();
    });

    it("Deve renderizar o texto descritivo", () => {
        renderWithRouter(<MainText />);

        expect(
            screen.getByText(
                /o vale pallet é a plataforma completa para controle/i
            )
        ).toBeInTheDocument();
    });

    it("Deve renderizar o botão 'Cadastre-se'", () => {
        renderWithRouter(<MainText />);

        expect(
            screen.getByRole("link", {
                name: /cadastre-se/i,
            })
        ).toBeInTheDocument();
    });

    it("O botão 'Cadastre-se' deve apontar para a rota correta", () => {
        renderWithRouter(<MainText />);

        expect(
            screen.getByRole("link", {
                name: /cadastre-se/i,
            })
        ).toHaveAttribute("href", "/cadastre-se");
    });

    it("Deve renderizar o botão 'Saiba Mais'", () => {
        renderWithRouter(<MainText />);

        expect(
            screen.getByRole("button", {
                name: /saiba mais/i,
            })
        ).toBeInTheDocument();
    });

    it("Deve possuir dois botões de ação", () => {
        renderWithRouter(<MainText />);

        const links = screen.getAllByRole("link");
        const buttons = screen.getAllByRole("button");

        expect(buttons).toHaveLength(1);
        expect(links).toHaveLength(1);
    });
});
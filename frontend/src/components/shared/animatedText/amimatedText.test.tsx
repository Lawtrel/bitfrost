import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import AnimatedText from "./animatedText";
import { useRotatingText } from "@/hooks/rotatingText/useRotatingText";

vi.mock("@/hooks/rotatingText/useRotatingText", () => ({
    useRotatingText: vi.fn(),
}));

const mockedUseRotatingText = vi.mocked(useRotatingText);

describe("AnimatedText", () => {
    const items = [
        "Mensagem 1",
        "Mensagem 2",
        "Mensagem 3",
    ];

    beforeEach(() => {
        vi.clearAllMocks();

        mockedUseRotatingText.mockReturnValue(0);
    });

    it("Deve renderizar o componente", () => {
        render(<AnimatedText items={items} />);

        expect(screen.getByText("Mensagem 1")).toBeInTheDocument();
    });

    it("Deve exibir a mensagem correspondente ao índice retornado pelo hook", () => {
        mockedUseRotatingText.mockReturnValue(2);

        render(<AnimatedText items={items} />);

        expect(screen.getByText("Mensagem 3")).toBeInTheDocument();
    });

    it("Deve chamar o hook com os parâmetros corretos", () => {
        render(<AnimatedText items={items} interval={5000} />);

        expect(mockedUseRotatingText).toHaveBeenCalledWith({
            items,
            interval: 5000,
        });
    });

    it("Deve utilizar o intervalo padrão quando nenhum for informado", () => {
        render(<AnimatedText items={items} />);

        expect(mockedUseRotatingText).toHaveBeenCalledWith({
            items,
            interval: 4000,
        });
    });

    it("Deve aplicar as classes de estilo corretamente", () => {
        render(<AnimatedText items={items} />);

        const text = screen.getByText("Mensagem 1");

        expect(text).toHaveClass(
            "text-transparent",
            "bg-clip-text",
            "bg-gradient-to-r",
            "from-indigo-600",
            "to-purple-600"
        );
    });
});
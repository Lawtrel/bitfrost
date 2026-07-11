import { render, screen } from "@testing-library/react";
import { describe, vi } from "vitest";
import ApresentationHero from "./apresentationHero";
import { useMediaLoading } from "@/hooks/mediaLoading/useMediaLoading";

// Para saber quais os nomes dos testes a serem executados screen.logTestingPlaygroundURL();

vi.mock("@/hooks/mediaLoading/useMediaLoading");
const mockedUseMediaLoading = vi.mocked(useMediaLoading);

const mockUseMediaLoading = {
    progress: 0,
    isLoading: true,
    completeLoading: vi.fn(),
    reset: vi.fn(),
};

beforeEach(() => {
    vi.resetAllMocks();
    mockedUseMediaLoading.mockReturnValue(mockUseMediaLoading);
});


describe("ApresentationHero", () => {

    it("Componente deve ser renderizado corretamente", () => {
        render(
            <ApresentationHero />
        )

        const apresentation = screen.getByTestId("apresentation")

        expect(apresentation).toBeInTheDocument();
    });

    it("Deve renderizar a imagem", () => {
        render(
            <ApresentationHero />
        )

        const apresentation = screen.getByRole('img', { name: /imagem representado o projeto/i })

        expect(apresentation).toBeInTheDocument();
    });

    it("Deve exibir a barra de progresso enquanto estiver carregando", () => {
        mockedUseMediaLoading.mockReturnValue({
            ...mockUseMediaLoading,
            progress: 50,
            isLoading: true,
        });

        render(<ApresentationHero />);

        expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    it("Não deve exibir a barra quando o carregamento terminar", () => {
        mockedUseMediaLoading.mockReturnValue({
            ...mockUseMediaLoading,
            progress: 100,
            isLoading: false,
        });

        render(<ApresentationHero />);

        expect(
            screen.queryByRole("progressbar")
        ).not.toBeInTheDocument();
    });

    it("Deve aplicar as classes de loading na imagem", () => {
        mockedUseMediaLoading.mockReturnValue({
            ...mockUseMediaLoading,
            progress: 50,
            isLoading: true,
        });

        render(<ApresentationHero />);

        const image = screen.getByRole("img");

        expect(image).toHaveClass(
            "blur-xl",
            "scale-105",
            "opacity-60"
        );
    });

    it("Deve remover as classes de loading após concluir o carregamento", () => {
        mockedUseMediaLoading.mockReturnValue({
            ...mockUseMediaLoading,
            progress: 100,
            isLoading: false,
        });

        render(<ApresentationHero />);

        const image = screen.getByRole("img");

        expect(image).toHaveClass(
            "blur-0",
            "scale-100",
            "opacity-100"
        );
    });
})
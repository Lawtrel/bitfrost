import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Logo from "./logo";

describe("Logo", () => {
    it("Deve renderizar o componente", () => {
        render(<Logo size={6} />);

        expect(
            screen.getByAltText(/bifrost logo/i)
        ).toBeInTheDocument();
    });

    it("Deve aplicar o tamanho informado", () => {
        render(<Logo size={8} />);

        const image = screen.getByAltText(/bifrost logo/i);

        expect(image).toHaveStyle({
            width: "8rem",
            height: "8rem",
        });
    });

    it("Deve utilizar loading eager por padrão", () => {
        render(<Logo size={6} />);

        expect(
            screen.getByAltText(/bifrost logo/i)
        ).toHaveAttribute("loading", "eager");
    });

    it("Deve utilizar loading lazy quando informado", () => {
        render(<Logo size={6} isLazy />);

        expect(
            screen.getByAltText(/bifrost logo/i)
        ).toHaveAttribute("loading", "lazy");
    });

    it("Deve possuir o caminho correto da imagem", () => {
        render(<Logo size={6} />);

        expect(
            screen.getByAltText(/bifrost logo/i)
        ).toHaveAttribute("src", "/assets/Logo Bifrost.png");
    });
});
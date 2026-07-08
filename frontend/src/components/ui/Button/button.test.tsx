import { fireEvent, render, screen } from "@testing-library/react";
import { describe } from "vitest";
import Button from "./button";
import { MemoryRouter } from "react-router-dom";

describe("Button", () => {

    it('Deve renderizar o texto corretamente', () => {
        render (
            <Button>Cadastrar</Button>
        );

        expect(screen.getByText("Cadastrar")).toBeInTheDocument();
    })

    it('Deve renderizar como link quando href for informado', () => {
        render(
            <MemoryRouter>
                <Button href="/cadastre-se">Cadastre-se</Button>
            </MemoryRouter>
        )

        const link = screen.getByText("Cadastre-se")

        expect(link).toHaveAttribute("href", "/cadastre-se")
    });

    it("Deve renderizar um botão quando não possuir href", () => {
        render(
            <Button>Login</Button>
        )

        const button = screen.getByRole("button")

        expect(button).toBeInTheDocument();
    })

    it("Deve executar um evento de click", () => {
        const handleClick = vi.fn();
        
        render(
            <Button onClick={handleClick}>Entrar</Button>
        );

        fireEvent.click(screen.getByRole("button"));

        expect(handleClick).toHaveBeenCalledOnce();
    })

    it("Deve renderizar o ícone quando informado", () => {
        render(
            <Button leftIcon={<span data-testid="button-icon">→</span>}>Continuar</Button>
        )

        expect(
            screen.getByTestId("button-icon")
        ).toBeInTheDocument();
    })

    it("Deve renderizar o ícone antes do texto quando for leftIcon", () => {
        const { container } = render(
            <Button leftIcon={<span>→</span>}>Avançar</Button>
        );

        expect(
            container.textContent
        )
        .toBe("→Avançar");

    });

    it("Deve renderizar o ícone depois do texto quando for rightIcon", () => {
        const { container } = render(
            <Button rightIcon={<span>→</span>}>Avançar</Button>
        );

        expect(
            container.textContent
        )
        .toBe("Avançar→");

    });

    it("Deve aplicar classe padrão", () => {
        render(
            <Button>Padrão</Button>
        )

        expect(screen.getByRole("button")).toHaveClass("hover:cursor-pointer")
    })

    it("Deve aplicar alguma variante", () => {

        render(
            <Button variant="primary">Primary</Button>
        );

        expect(
            screen.getByRole("button")
        ).toHaveClass(
            "bg-gradient-to-br"
        );
    });

    it("Deve aplicar tamanho correto", () => {

        render(
            <Button size="lg">Grande</Button>
        );

        expect(
            screen.getByRole("button")
        )
        .toHaveClass(
            "h-12"
        );
    });

    it("Deve aceitar classes personalizadas", () => {
        const { container } = render(
            <Button className="custom-class">Personalizado</Button>
        )

        expect(container.firstChild).toHaveClass("custom-class")
    })

})
import { render, screen } from "@testing-library/react"
import { describe, it } from "vitest"
import NavbarHeader from "./navbarHeader"
import { MemoryRouter } from "react-router-dom";

function renderWithRouter(component: React.ReactNode, initialEntries = ["/"]) {
    return render(
        <MemoryRouter initialEntries={initialEntries}>
            {component}
        </MemoryRouter>
    );
}

describe("NavbarHeader", () => {
    it("Componente é renderizado corretamente",() => {
        renderWithRouter(
            <NavbarHeader name="link" link="/" />
        )
        const link = screen.getByRole("link", {name: /link/i})
        
        expect(link).toBeInTheDocument()
    });

    it("Deve renderizar o texto do link", () => {
        renderWithRouter(
            <NavbarHeader name="link" link="/" />
        )

        const link = screen.getByText("link")

        expect(link).toBeInTheDocument();
    });

    it("O link deve redirecionar corretamente",() => {
        renderWithRouter(
            <NavbarHeader name="home" link="/" />
        )
        const link = screen.getByRole("link", {name: /home/i})
        
        expect(link).toHaveAttribute("href", "/");
    });

    it("Deve aplicar a classe se a rota estiver ativa", () => {
        renderWithRouter(
            <NavbarHeader name="home" link="/" />
        )

        const link = screen.getByRole("link", {name: /home/i})

        expect(link).toHaveClass("underline", "text-indigo-600")
    })

    it("Não deve aplicar a classe se a rota não estiver ativa", () => {
        renderWithRouter(
            <NavbarHeader name="Sobre nós" link="/sobre-nos" />
        )

        const link = screen.getByRole("link", {name: /sobre nós/i})

        expect(link).not.toHaveClass("underline", "text-indigo-600");
    })
})
import { render, screen } from "@testing-library/react"
import { describe, it } from "vitest"
import Header from "./header"
import { MemoryRouter } from "react-router-dom";

function renderWithRouter(component: React.ReactNode) {
    return render(
        <MemoryRouter>
            {component}
        </MemoryRouter>
    );
}

describe("Header", () => {
    it("O componente é renderizado", () => {
        renderWithRouter(
            <Header />
        )

        const header = screen.getByRole("banner");

        expect(header).toBeInTheDocument();
    });

    it("A logo é renderizada", () => {
        renderWithRouter(
            <Header />
        )

        const logo = screen.getByRole('img', { name: /bifrost logo/i });

        expect(logo).toBeInTheDocument();
    });

    it("O nome do projeto é renderizado", () => {
        renderWithRouter(
            <Header />
        )

        const logo = screen.getByRole('heading', { name: /valle pallet/i });

        expect(logo).toBeInTheDocument();
    });

    it("A barra de navegação é renderizada", () => {
        renderWithRouter(
            <Header />
        )

        const navbar = screen.getByRole('navigation', { name: /menu principal/i });

        expect(navbar).toBeInTheDocument();
    });

    it("Os links existem", () => {
        renderWithRouter(
            <Header />
        )

        const link1 = screen.getByRole('link', { name: /home/i });
        const link2 = screen.getByRole('link', { name: /sobre nós/i });
        const link3 = screen.getByRole('link', { name: /contato/i });
        
        expect(link1).toBeInTheDocument();
        expect(link2).toBeInTheDocument();
        expect(link3).toBeInTheDocument();
    });

    it("Link de login existe", () => {
        renderWithRouter(
            <Header />
        )

        const link = screen.getByRole('link', { name: /login/i });

        expect(link).toBeInTheDocument();
    });

    it("Link de cadastro existe", () => {
        renderWithRouter(
            <Header />
        )

        const link = screen.getByRole('link', { name: /cadastre-se/i });

        expect(link).toBeInTheDocument();
    });
})
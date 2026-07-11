import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CarouselHero from "./carouselHero";
import { heroCards } from "./heroCards";

import { MemoryRouter } from "react-router-dom";

function renderWithRouter(component: React.ReactNode) {
    return render(
        <MemoryRouter>
            {component}
        </MemoryRouter>
    );
}

vi.mock("@/components/ui/Carousel", () => ({
    Carousel: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="carousel">{children}</div>
    ),

    CarouselContent: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="carousel-content">{children}</div>
    ),

    CarouselItem: ({ children }: { children: React.ReactNode }) => (
        <div role="group" data-testid="carousel-item">{children}</div>
    ),

    CarouselButtonPrev: () => (
        <button data-testid="button-prev">Prev</button>
    ),

    CarouselButtonNext: () => (
        <button data-testid="button-next">Next</button>
    ),
}));

describe("CarouselHero", () => {
    it("Deve renderizar corretamente", () => {
        renderWithRouter(
            <CarouselHero />
        );

        expect(screen.getByTestId("carousel")).toBeInTheDocument();
    });

    it("Deve renderizar o botão anterior", () => {
        renderWithRouter(
            <CarouselHero />
        );

        expect(
            screen.getByTestId("button-prev")
        ).toBeInTheDocument();
    });

    it("Deve renderizar o botão próximo", () => {
        renderWithRouter(
            <CarouselHero />
        );

        expect(
            screen.getByTestId("button-next")
        ).toBeInTheDocument();
    });

    it("Deve renderizar todos os cards cadastrados", () => {
        renderWithRouter(
            <CarouselHero />
        );

        const cards = screen.getAllByTestId("card");

        expect(cards).toHaveLength(heroCards.length);
    });

    it("Deve renderizar todos os CarouselItem", () => {
        renderWithRouter(
            <CarouselHero />
        );

        const items = screen.getAllByRole("group");

        expect(items).toHaveLength(heroCards.length);
    });

    it("Deve renderizar todos os títulos", () => {
        renderWithRouter(
            <CarouselHero />
        );

        heroCards.forEach((card) => {
            expect(
                screen.getByText(card.title)
            ).toBeInTheDocument();
        });
    });

    it("Deve renderizar todas as descrições", () => {
        renderWithRouter(
            <CarouselHero />
        );

        heroCards.forEach((card) => {
            expect(
                screen.getByText(card.description)
            ).toBeInTheDocument();
        });
    });

    it("Deve renderizar um ícone para cada card", () => {
        renderWithRouter(
            <CarouselHero />
        );

        const headers = screen.getAllByTestId("card-header");

        expect(headers).toHaveLength(heroCards.length);
    });

    it("Deve renderizar o CarouselContent", () => {
        renderWithRouter(
            <CarouselHero />
        );

        expect(
            screen.getByTestId("carousel-content")
        ).toBeInTheDocument();
    });

    it("Cada card deve exibir o título e descrição correspondentes", () => {
        renderWithRouter(
            <CarouselHero />
        );

        heroCards.forEach(({ title, description }) => {
            expect(screen.getByText(title)).toBeVisible();
            expect(screen.getByText(description)).toBeVisible();
        });
    });
});
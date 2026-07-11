import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Hero from "./hero";

vi.mock("./mainText", () => ({
    default: () => <div data-testid="main-text">MainText</div>,
}));

vi.mock("./apresentationHero", () => ({
    default: () => <div data-testid="apresentation-hero">ApresentationHero</div>,
}));

vi.mock("./carouselHero", () => ({
    default: () => <div data-testid="carousel-hero">CarouselHero</div>,
}));

describe("Hero", () => {
    it("Deve renderizar corretamente", () => {
        render(<Hero />);

        expect(screen.getByRole("main")).toBeInTheDocument();
    });

    it("Deve renderizar o MainText", () => {
        render(<Hero />);

        expect(screen.getByTestId("main-text")).toBeInTheDocument();
    });

    it("Deve renderizar o ApresentationHero", () => {
        render(<Hero />);

        expect(screen.getByTestId("apresentation-hero")).toBeInTheDocument();
    });

    it("Deve renderizar o CarouselHero", () => {
        render(<Hero />);

        expect(screen.getByTestId("carousel-hero")).toBeInTheDocument();
    });

    it("Deve renderizar a imagem de fundo", () => {
        render(<Hero />);

        const image = screen.getByRole("img", {
            name: /imagem de fundo do hero/i,
        });

        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute("src", "/assets/Hero Bifrost.png");
    });

    it("Deve manter a estrutura principal do layout", () => {
        render(<Hero />);

        const main = screen.getByRole("main");

        expect(main).toContainElement(screen.getByTestId("main-text"));
        expect(main).toContainElement(screen.getByTestId("apresentation-hero"));
        expect(main).toContainElement(screen.getByTestId("carousel-hero"));
    });
});
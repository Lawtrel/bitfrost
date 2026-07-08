import { useCarousel } from "@/hooks/carousel/useCarouselContext";
import { useCarouselState } from "@/hooks/carousel/useCarouselState";
import { describe, vi } from "vitest";
import Carousel from "./carousel";
import { render, screen } from "@testing-library/react";

vi.mock("@/hooks/carousel/useCarouselState", () => ({
    useCarouselState: vi.fn(() => ({
        api: undefined,
        carouselRef: vi.fn(),
        selectedIndex: 0,
        scrollSnaps: [0, 1, 2],
        slidesCount: 3,
        canScrollPrev: false,
        canScrollNext: true,
        scrollPrev: vi.fn(),
        scrollNext: vi.fn(),
        scrollTo: vi.fn(),
    })),
}));

function TestChild () {
    const carousel = useCarousel();
    return(
        <div data-testid='carousel-child'>
            Slide atual: {carousel.selectedIndex}
        </div>
    )
}

describe("Carousel",  () => {
    it("Deve renderizar os filhos dentro do carousel", () => {
        render(
            <Carousel>
                <div>
                    Conteúdo do carrossel
                </div>
            </Carousel>
        );

        expect(screen.getByText("Conteúdo do carrossel")).toBeInTheDocument();
    });

    it("Deve disponibilizar o conteúdo para componentes filhos", () => {
        render(
            <Carousel>
                <TestChild />
            </Carousel>
        )

        expect(screen.getByTestId("carousel-child")).toHaveTextContent("Slide atual: 0")
    })

    it("Deve aceitar classes personalizadas", () => {
        render(
            <Carousel data-testid="carousel" className="custom-class">
                Conteúdo
            </Carousel>
        )

        const element = screen.getByTestId("carousel")

        expect(element).toHaveClass("custom-class");
    });
    
})
import { getByTestId, render, screen } from "@testing-library/react";
import { CarouselContext, CarouselContextData } from "./carouselContext";
import { describe } from "vitest";
import CarouselContent from "./carouselContent";
import { mockCarouselContext } from "@/test/mocks/carouselmock";

function renderWithProvider(component: React.ReactNode, context= mockCarouselContext) {
    return(
        render(
            <CarouselContext.Provider value={context}>
                {component}
            </CarouselContext.Provider>
        )
    );
}
describe("Carousel Content", () => {

    it("Deve renderizar os componentes filhos", () => {
        renderWithProvider(
            <CarouselContent>
                <div>Slide 1</div>
            </CarouselContent>
        );

        expect(screen.getByText("Slide 1")).toBeInTheDocument();
    })

    it ("Deve aplicar o viewportClassName e manter classe padrão", () => {
        renderWithProvider(
            <CarouselContent viewportClassName="custom-class" />
        )

        const viewport = screen.getByTestId("viewport-classname");

        expect(viewport).toHaveClass("custom-class", "overflow-hidden");
    });

    it("Deve aplicar className ao container interno e manter classe padrão", () => {
        renderWithProvider(
            <CarouselContent className="custom-class"/>
        )

        const className = screen.getByTestId("carousel-content");

        expect(className).toHaveClass("custom-class", "flex");
    })

    it("Deve repassar as props HTML", () => {
        renderWithProvider(
            <CarouselContent data-testid="carousel-content" aria-label="Lista de Slides" />
        )

        expect(screen.getByTestId("carousel-content")).toHaveAttribute("aria-label", "Lista de Slides")
    });

    it("Deve lançar erro quando utilizado fora do provider", () => {
        expect(() => {
            render(
                <CarouselContent />
            )
        }).toThrow("useCarousel deve ser utilizado dentro de um <Carousel />.")
    })

})
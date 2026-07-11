import { render, screen } from "@testing-library/react";
import { CarouselContext, CarouselContextData } from "./carouselContext";
import { mockCarouselContext } from "@/test/mocks/carouselmock";
import CarouselCounter from "./carouselCounter";

function renderWithProvider(component: React.ReactNode, context= mockCarouselContext) {
        return(
            render(
                <CarouselContext.Provider value={context}>
                    {component}
                </CarouselContext.Provider>
            )
        );
}

describe("carouselCounter", () => {
    it("Deve renderizar o contator corretamente", () => {
        renderWithProvider(
            <CarouselCounter data-testid="carousel-counter" />
        )

        expect(screen.getByTestId("carousel-counter")).toHaveTextContent("1 / 3");
    });

    it("Deve converter o indice para a posição correta", () => {
        renderWithProvider(
            <CarouselCounter data-testid="carousel-counter" />,
            {
                ...mockCarouselContext,
                selectedIndex: 2,
                slideCount: 5,
            }
        )

        expect(screen.getByTestId("carousel-counter")).toHaveTextContent("3 / 5")
    });

    it("Deve adionar um zero a esquerda quando leadingZero for verdadeiro", () => {
        renderWithProvider(
            <CarouselCounter data-testid="carousel-counter" leadingZero />,
            {
                ...mockCarouselContext,
                selectedIndex: 0,
                slideCount: 8,
            }
        );
        expect(screen.getByTestId("carousel-counter")).toHaveTextContent("01 / 08");
    })

    it("Deve utilizar um separador personalizado", () => {
        renderWithProvider(
            <CarouselCounter data-testid="carousel-counter" separator="|" />
        );

        expect(screen.getByTestId("carousel-counter")).toHaveTextContent("1 | 3")
    });

    it("Deve renderizar um sufixo personalizado", () => {
        renderWithProvider(
            <CarouselCounter data-testid="carousel-counter" suffix="oi" />
        );

        expect(screen.getByTestId("carousel-counter")).toHaveTextContent("1 / 3 oi")
    })

    it("Deve renderizar um prefixo personalizado", () => {
        renderWithProvider(
            <CarouselCounter data-testid="carousel-counter" prefix="oi" />
        );

        expect(screen.getByTestId("carousel-counter")).toHaveTextContent("oi 1 / 3")
    });

    it("Deve permitir className personalizado", () => {
        renderWithProvider(
            <CarouselCounter data-testid="carousel-counter" className="custom-class" />
        )

        expect(screen.getByTestId("carousel-counter")).toHaveClass("custom-class")
    });

    it("Deve emitir erro se renderizado fora do provider", () => {
        expect(() => {
            render(
                <CarouselCounter />
            )
        }).toThrow("useCarousel deve ser utilizado dentro de um <Carousel />.")
    });

    it("Deve repassar as propriedades HTML", () => {
        renderWithProvider(
            <CarouselCounter data-testid="carousel-counter" title="Contador de Carrossel" id="counter"/>
        );

        const counter = screen.getByTestId("carousel-counter")

        expect(counter).toHaveAttribute("title",  "Contador de Carrossel");
        expect(counter).toHaveAttribute("id",  "counter");
    })
})
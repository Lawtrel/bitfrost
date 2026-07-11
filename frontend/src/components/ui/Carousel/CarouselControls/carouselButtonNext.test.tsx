import { fireEvent, render, screen } from "@testing-library/react";
import { CarouselContext } from "../carouselContext";
import { mockCarouselContext } from "@/test/mocks/carouselmock";
import CarouselButtonNext from "./carouselButtonNext";

function renderWithProvider(component: React.ReactNode, context= mockCarouselContext) {
    return(
        render(
            <CarouselContext.Provider value={context}>
                {component}
            </CarouselContext.Provider>
        )
    );
}

describe("CarouselButtonNext", () => {
    it("Deve renderizar corretamente", () => {
        renderWithProvider(
            <CarouselButtonNext />
        )
    
        const buttonNext = screen.getByTestId("button-next")
    
        expect(buttonNext).toBeInTheDocument();
    });

    it("Deve emitir erro se renderizado fora do provider", () => {
        expect(() => {
            render(
                <CarouselButtonNext />
            )
        }).toThrow("useCarousel deve ser utilizado dentro de um <Carousel />.")
    });

    it("Não deve permitir ser clicado se estiver no último slide", () => {
        renderWithProvider(
            <CarouselButtonNext />,
            {
                ...mockCarouselContext,
                canScrollNext: false,
                slideCount: 3,
                selectedIndex: 3
            }
        )

        const buttonNext = screen.getByTestId("button-next")

        expect(buttonNext).toHaveAttribute("disabled")
    })

    it("Deve permitir ser clicado se estiver abaixo do último slide", () => {
        renderWithProvider(
            <CarouselButtonNext />,
            {
                ...mockCarouselContext,
                canScrollNext: true,
                slideCount: 3,
                selectedIndex: 0,
            }
        )

        const buttonNext = screen.getByTestId("button-next")

        expect(buttonNext).not.toHaveAttribute("disabled")
    })

    it("Container deve permitir classes personalizadas", () => {
        renderWithProvider(
            <CarouselButtonNext className="custom-class" />
        )

        const buttonNext = screen.getByTestId("button-next-container")

        expect(buttonNext).toHaveClass("custom-class")
    });

    it("Botão deve permitir classes personalizadas", () => {
        renderWithProvider(
            <CarouselButtonNext nextClassName="custom-class" />
        )

        const buttonNext = screen.getByTestId("button-next")

        expect(buttonNext).toHaveClass("custom-class")
    });

    it("Slide deve seguir para o próximo se botão for pressionado", () => {
        const scrollNext = vi.fn()
        renderWithProvider(
            <CarouselButtonNext />,
            {
                ...mockCarouselContext,
                slideCount: 5,
                selectedIndex: 3,
                canScrollPrev: true,
                scrollNext,
            }
        )
        const buttonNext = screen.getByTestId("button-next")
        fireEvent.click(buttonNext)
        expect(scrollNext).toHaveBeenCalledTimes(1);
    });
})
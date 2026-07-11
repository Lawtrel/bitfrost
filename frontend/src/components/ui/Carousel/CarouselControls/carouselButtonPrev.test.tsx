import { fireEvent, render, screen } from "@testing-library/react";
import { CarouselContext } from "../carouselContext";
import CarouselButtonPrev from "./carouselButtonPrev";
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

describe("CarouselButtonPrev", () => {
    it("Deve renderizar corretamente", () => {
        renderWithProvider(
            <CarouselButtonPrev />
        )
    
        const buttonPrev = screen.getByTestId("button-prev")
    
        expect(buttonPrev).toBeInTheDocument();
    });

    it("Deve emitir erro se renderizado fora do provider", () => {
        expect(() => {
            render(
                <CarouselButtonPrev />
            )
        }).toThrow("useCarousel deve ser utilizado dentro de um <Carousel />.")
    });

    it("Não deve permitir ser clicado se estiver no primeiro slide", () => {
        renderWithProvider(
            <CarouselButtonPrev />,
            {
                ...mockCarouselContext,
                canScrollPrev: false,
                selectedIndex: 0,
            }
        )

        const buttonPrev = screen.getByTestId("button-prev")

        expect(buttonPrev).toHaveAttribute("disabled")
    })

    it("Deve permitir ser clicado se estiver acima do primeiro slide", () => {
        renderWithProvider(
            <CarouselButtonPrev />,
            {
                ...mockCarouselContext,
                canScrollPrev: true,
                selectedIndex: 2,
            }
        )

        const buttonPrev = screen.getByTestId("button-prev")

        expect(buttonPrev).not.toHaveAttribute("disabled")
    })

    it("Container deve permitir classes personalizadas", () => {
        renderWithProvider(
            <CarouselButtonPrev className="custom-class" />
        )

        const buttonPrev = screen.getByTestId("button-prev-container")

        expect(buttonPrev).toHaveClass("custom-class")
    });

    it("Botão deve permitir classes personalizadas", () => {
        renderWithProvider(
            <CarouselButtonPrev previousClassName="custom-class" />
        )

        const buttonPrev = screen.getByTestId("button-prev")

        expect(buttonPrev).toHaveClass("custom-class")
    });

    it("Slide deve seguir para o anterior se botão for pressionado", () => {
        const scrollPrev = vi.fn()
        renderWithProvider(
            <CarouselButtonPrev />,
            {
                ...mockCarouselContext,
                slideCount: 5,
                selectedIndex: 4,
                canScrollPrev: true,
                scrollPrev,
            }
        )
        const buttonPrev = screen.getByTestId("button-prev")
        fireEvent.click(buttonPrev)
        expect(scrollPrev).toHaveBeenCalledTimes(1);
    });
})
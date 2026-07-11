import { mockCarouselContext } from "@/test/mocks/carouselmock";
import { getAllByRole, render, screen } from "@testing-library/react";
import { CarouselContext } from "./carouselContext";
import CarouselItem from "./carouselItem";
import { createRef } from "react";

function renderWithProvider(component: React.ReactNode, context= mockCarouselContext) {
    return(
        render(
            <CarouselContext.Provider value={context}>
                {component}
            </CarouselContext.Provider>
        )
    );
}

describe("CarouselItem", () => {
    it("Deve renderizar o componente filho", () => {
        renderWithProvider(
            <CarouselItem>
                <p>Card</p>
            </CarouselItem>,
        );

        const item = screen.getByText("Card")

        expect(item).toBeInTheDocument();
    })

    it("Deve aplicar a className personalizada e manter classe padrão", () => {
        renderWithProvider(
            <CarouselItem className="custom-class">Card</CarouselItem>
        )

        const item  = screen.getByText("Card")

        expect(item).toHaveClass("custom-class", "min-w-0");
    })

    it("Deve passar os atributos HTML", () => {
        renderWithProvider(
            <CarouselItem title="My Slide" id="slide-1">Card</CarouselItem>
        )

        const item  = screen.getByText("Card")

        expect(item).toHaveAttribute("title", "My Slide")
        expect(item).toHaveAttribute("id", "slide-1")
    })

    it("Deve possuir a role group", () => {
        renderWithProvider(
            <CarouselItem role="group">Card</CarouselItem>
        )

        const item  = screen.getByText("Card")

        expect(item).toHaveAttribute("role", "group")
    })

    it("Deve possuir o aria-roledescription slide", () => {
        renderWithProvider(
            <CarouselItem aria-roledescription="slide">Card</CarouselItem>
        )

        const item  = screen.getByText("Card")

        expect(item).toHaveAttribute("aria-roledescription", "slide")
    });

    it("Deve encaminhar a ref corretamente", () => {
        const ref = createRef<HTMLDivElement>();

        renderWithProvider(
            <CarouselItem ref={ref}>Slide</CarouselItem>
        );

        expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("Deve emitir erro se renderizado fora do provider", () => {
        expect(() => {
            render(
                <CarouselItem>Slide</CarouselItem>
            )
        }).toThrow("useCarousel deve ser utilizado dentro de um <Carousel />.")
    });
})
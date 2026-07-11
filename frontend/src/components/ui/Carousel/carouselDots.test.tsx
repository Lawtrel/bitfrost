import { mockCarouselContext } from "@/test/mocks/carouselmock";
import { CarouselContext } from "./carouselContext";
import { fireEvent, render, screen } from "@testing-library/react";
import CarouselDots from "./carouselDots";

function renderWithProvider(component: React.ReactNode, context= mockCarouselContext) {
        return(
            render(
                <CarouselContext.Provider value={context}>
                    {component}
                </CarouselContext.Provider>
            )
        );
}

describe("CarouselDots", () => {
    it("Deve renderizar os dots corretamente", () => {
        renderWithProvider(
            <CarouselDots />
        )

        const dots = screen.getAllByRole("button")

        expect(dots).toHaveLength(3)
    });

    it("Deve aplicar className personalizada e manter a padrão", () => {
        const {container} = renderWithProvider(
            <CarouselDots className="custom-class" />
        )

        const wrapper = container.firstChild;

        expect(wrapper).toHaveClass("custom-class", "flex")
    });

    it("Deve aplicar dotClassName ao dot inativo", () => {
        renderWithProvider(
            <CarouselDots dotClassName="custom-class" />
        )

        const dots = screen.getAllByRole("button");

        expect(dots[1]).toHaveClass("custom-class");
        expect(dots[2]).toHaveClass("custom-class");

        expect(dots[0]).not.toHaveClass("custom-class");
    })

    it("Deve aplicar activeDotClassName ao dot ativo", () => {
        renderWithProvider(
            <CarouselDots activeDotClassName="custom-class" />
        )

        const dots = screen.getAllByRole("button");

        expect(dots[1]).not.toHaveClass("custom-class");
        expect(dots[2]).not.toHaveClass("custom-class");

        expect(dots[0]).toHaveClass("custom-class");
    });

    it("Deve chamar o scroollTo ao clicar em um dot", () => {
        const scrollTo = vi.fn()
        renderWithProvider(
            <CarouselDots />,
            {
                ...mockCarouselContext,
                scrollTo,
            }
        );

        const dots = screen.getAllByRole("button")

        fireEvent.click(dots[2]);

        expect(scrollTo).toHaveBeenCalledOnce();
        expect(scrollTo).toHaveBeenCalledWith(2);
    });

    it("Deve marcar corretamente o dot ativo", () => {
        renderWithProvider(
            <CarouselDots />,
            {
                ...mockCarouselContext,
                selectedIndex: 1,
            }
        );

        const dots = screen.getAllByRole("button")

        expect(dots[1]).toHaveAttribute("aria-current", "true")

        expect(dots[0]).toHaveAttribute("aria-current", "false")
        expect(dots[2]).toHaveAttribute("aria-current", "false")
    });

    it.each([
        ["sm", "w-2", "h-2"],
        ["md", "w-3", "h-3"],
        ["lg", "w-4", "h-4"],
    ])(
        "Deve aplicar o tamanho %s",
        (size, width, height) => {
        renderWithProvider(
            <CarouselDots
            size={size as "sm" | "md" | "lg"}
            />
        );

        const dot = screen.getAllByRole("button")[0];

        expect(dot).toHaveClass(
            width,
            height
        );
        }
    );

    it.each([
        ["sm", "gap-2"],
        ["md", "gap-3"],
        ["lg", "gap-5"],
    ])(
        "Deve aplicar o gap %s",
        (gap, gapClass) => {
        const { container } = renderWithProvider(
            <CarouselDots
            gap={gap as "sm" | "md" | "lg"}
            />
        );

        expect(container.firstChild).toHaveClass(
            gapClass
        );
        }
    );

    it("Deve passar as propriedades HTML", () => {
        renderWithProvider(
            <CarouselDots
                title="Ir para slide"
            />
        )

        const dots = screen.getAllByRole("button")[0];

        expect(dots).toHaveAttribute("title", "Ir para slide")
    });

    it("Não deve renderizar dots quando não houver slides", () => {
        renderWithProvider(
            <CarouselDots />,
            {
                ...mockCarouselContext,
                scrollSnaps: [],
                slideCount: 0,
            }
        )

        const dots = screen.queryAllByRole("button");

        expect(dots).toHaveLength(0)
    });

    it("Deve emitir erro se renderizado fora do provider", () => {
        expect(() => {
            render(
                <CarouselDots />
            )
        }).toThrow("useCarousel deve ser utilizado dentro de um <Carousel />.")
    })
})
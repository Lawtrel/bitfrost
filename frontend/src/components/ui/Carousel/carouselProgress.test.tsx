import { mockCarouselContext } from "@/test/mocks/carouselmock";
import { render, screen } from "@testing-library/react";
import { CarouselContext } from "./carouselContext";
import CarouselProgress from "./carouselProgress";

function renderWithProvider(component: React.ReactNode, context= mockCarouselContext) {
    return(
        render(
            <CarouselContext.Provider value={context}>
                {component}
            </CarouselContext.Provider>
        )
    );
}

describe("CarouselProgress", () => {
    it("Deve renderizar corretamente", () => {
        renderWithProvider(
            <CarouselProgress />
        )

        const progress = screen.getByTestId("carousel-progress")

        expect(progress).toBeInTheDocument();
    });
    
    it("Deve emitir erro se renderizado fora do provider", () => {
        expect(() => {
            render(
                <CarouselProgress />
            )
        }).toThrow("useCarousel deve ser utilizado dentro de um <Carousel />.")
    });

    it("Deve aplicar classe customizada e manter classe padrão", () => {
        renderWithProvider(
            <CarouselProgress className="custom-class" />
        )

        const progress = screen.getByTestId("carousel-progress")

        expect(progress).toHaveClass("custom-class", "w-full")
    });

    it("Deve aplicar o trackClassName e classe padrão", () => {
        renderWithProvider(
            <CarouselProgress trackClassName="custom-class" />
        )

        const progress = screen.getByTestId("carousel-progress-track")

        expect(progress).toHaveClass("custom-class", "w-full")
    });

    it("Deve aplicar o progressClassName e classe padrão", () => {
        renderWithProvider(
            <CarouselProgress progressClassName="custom-class" />
        )

        const progress = screen.getByTestId("carousel-progress-bar")

        expect(progress).toHaveClass("custom-class", "h-full")
    });

    it("Deve calcular corretamente a largura da barra", () => {
        renderWithProvider(
            <CarouselProgress/>,
            {
                ...mockCarouselContext,
                slideCount: 5,
                selectedIndex: 2,
            }
        );

        const progress = screen.getByTestId("carousel-progress-bar")

        expect(progress).toHaveStyle({width: "60%",});
    });

    it("Deve exibir a porcentagem quando showPercentage for verdadeiro", () => {
        renderWithProvider(
            <CarouselProgress showPercentage />,
            {
                ...mockCarouselContext,
                slideCount: 5,
                selectedIndex: 2,
            }
        )

        const progress = screen.getByTestId("carousel-progress-percentage")

        expect(progress).toHaveTextContent("60%");
    })

    it("Não deve exibir a porcentagem quando showPercentage for falso", () => {
        renderWithProvider(
            <CarouselProgress />
        )

        const progress = screen.queryByTestId("carousel-progress-percentage")

        expect(progress).not.toBeInTheDocument();
    })

    it("Deve aplicar o percentageClassName e classe padrão", () => {
        renderWithProvider(
            <CarouselProgress showPercentage percentageClassName="custom-class" />
        )

        const progress = screen.getByTestId("carousel-progress-percentage")

        expect(progress).toHaveClass("custom-class", "mt-2");
    });

    it("Deve atualizar a largura quando selectedIndex mudar", () => {
        const { rerender } = render(
            <CarouselContext.Provider
                value={{
                ...mockCarouselContext,
                selectedIndex: 0,
                slideCount: 5,
                }}
            >
                <CarouselProgress />
            </CarouselContext.Provider>
        );

        expect(
        screen.getByTestId(
            "carousel-progress-bar"
        )).toHaveStyle({
        width: "20%",
        });

        rerender(
        <CarouselContext.Provider
            value={{
            ...mockCarouselContext,
            selectedIndex: 3,
            slideCount: 5,
            }}
        >
            <CarouselProgress />
        </CarouselContext.Provider>
        );

        expect(
        screen.getByTestId(
            "carousel-progress-bar"
        )
        ).toHaveStyle({
        width: "80%",
        });
    });

    it("Deve atualizar a porcentagem quando selectedIndex mudar", () => {
        const { rerender } = render(
            <CarouselContext.Provider
                value={{
                ...mockCarouselContext,
                selectedIndex: 1,
                slideCount: 5,
                }}
            >
                <CarouselProgress
                    showPercentage
                />
            </CarouselContext.Provider>
        );
        expect(
            screen.getByTestId(
            "carousel-progress-percentage"
        )).toHaveTextContent("40%");

        rerender(
            <CarouselContext.Provider
                value={{
                ...mockCarouselContext,
                selectedIndex: 4,
                slideCount: 5,
                }}
            >
                <CarouselProgress
                showPercentage
                />
            </CarouselContext.Provider>
        );

        expect(
        screen.getByTestId(
            "carousel-progress-percentage"
        )).toHaveTextContent("100%");
    });

})
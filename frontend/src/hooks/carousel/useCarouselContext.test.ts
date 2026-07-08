import { createElement, type ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import { useCarousel } from "./useCarouselContext";
import { CarouselContext } from "@/components/ui/Carousel/carouselContext";


describe("useCarousel", () => {

  it("Deve retornar o contexto quando utilizado dentro do Provider", () => {
    const mockContext = {
      api: undefined,
      carouselRef: () => {},
      selectedIndex: 0,
      scrollSnaps: [0, 1, 2],
      slideCount: 3,
      canScrollPrev: false,
      canScrollNext: true,
      scrollPrev: () => {},
      scrollNext: () => {},
      scrollTo: () => {},
    };

    const wrapper = ({ children }: { children: ReactNode }) =>
      createElement(CarouselContext.Provider, { value: mockContext }, children);

    const { result } = renderHook(() => useCarousel(), { wrapper });

    expect(result.current).toEqual(mockContext);
  });



  it("Deve lançar erro quando utilizado fora do Provider", () => {


    expect(() => {

      renderHook(() => useCarousel());

    }).toThrow(
      "useCarousel deve ser utilizado dentro de um <Carousel />."
    );


  });


});
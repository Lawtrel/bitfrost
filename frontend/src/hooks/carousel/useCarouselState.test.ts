import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import useEmblaCarousel from "embla-carousel-react";
import type { EmblaCarouselType } from "embla-carousel";

import { useCarouselState } from "./useCarouselState";


vi.mock("embla-carousel-react", () => ({
    default: vi.fn(),
}));


describe("useCarouselState", () => {

    const scrollPrev = vi.fn();
    const scrollNext = vi.fn();
    const scrollTo = vi.fn();

    let selectCallback: (() => void) | undefined;
    let reInitCallback: (() => void) | undefined;

    const mockEventHandler = {
        init: vi.fn(),
        emit: vi.fn(),
        on: vi.fn(),
        off: vi.fn(),
        clear: vi.fn(),
    };

    const mockApi: Partial<EmblaCarouselType> = {
        selectedScrollSnap: vi.fn(() => 0),
        canScrollPrev: vi.fn(() => false),
        canScrollNext: vi.fn(() => true),
        scrollSnapList: vi.fn(() => [0, 1, 2]),
        scrollPrev,
        scrollNext,
        scrollTo,
        on: vi.fn((event, callback) => {
            if(event === "select") {
                selectCallback = callback;
            }
            if(event === "reInit") {
                reInitCallback = callback;
            }
            
            return  mockEventHandler;

        }),
        off: vi.fn(() => {
            return mockEventHandler;
        }),

    };


    beforeEach(() => {

        vi.clearAllMocks();

        selectCallback = undefined;

        reInitCallback = undefined;


        vi.mocked(useEmblaCarousel)
        .mockReturnValue([
            vi.fn(),
            mockApi as EmblaCarouselType
        ]);

    });

    it("Deve inicializar o carousel corretamente", () => {
        const { result } = renderHook(() =>
        useCarouselState()
        );

        expect(
        result.current.selectedIndex
        ).toBe(0);

        expect(
        result.current.scrollSnaps
        ).toEqual([0,1,2]);

        expect(
        result.current.slideCount
        ).toBe(3);

        expect(
        result.current.canScrollNext
        ).toBe(true);

        expect(
        result.current.canScrollPrev
        ).toBe(false);
    });

    it("Deve chamar os métodos iniciais da API", () => {
        renderHook(() =>
            useCarouselState()
        );

        expect(
        mockApi.scrollSnapList
        ).toHaveBeenCalled();

        expect(
        mockApi.selectedScrollSnap
        ).toHaveBeenCalled();

        expect(
        mockApi.canScrollPrev
        ).toHaveBeenCalled();

        expect(
        mockApi.canScrollNext
        ).toHaveBeenCalled();

    });

    it("Deve registrar os eventos do Embla", () => {
        renderHook(() =>
        useCarouselState()
        );

        expect(
        mockApi.on
        ).toHaveBeenCalledWith(
        "select",
        expect.any(Function)
        );

        expect(
        mockApi.on
        ).toHaveBeenCalledWith(
        "reInit",
        expect.any(Function)
        );
    });

    it("Deve atualizar os estados quando o evento select ocorrer", () => {
        const { result } = renderHook(() =>
        useCarouselState()
        );

        vi.mocked(
        mockApi.selectedScrollSnap!
        )
        .mockReturnValue(2);

        vi.mocked(
        mockApi.canScrollPrev!
        )
        .mockReturnValue(true);

        vi.mocked(
        mockApi.canScrollNext!
        )
        .mockReturnValue(false);

        act(() => {
            selectCallback?.();
        });

        expect(
        result.current.selectedIndex
        ).toBe(2);

        expect(
        result.current.canScrollPrev
        ).toBe(true);

        expect(
        result.current.canScrollNext
        ).toBe(false);
    });

    it("Deve remover os eventos ao desmontar", () => {
        const { unmount } = renderHook(() =>
            useCarouselState()
        );

        unmount();

        expect(
        mockApi.off
        ).toHaveBeenCalledWith(
        "select",
        expect.any(Function)
        );

        expect(
        mockApi.off
        ).toHaveBeenCalledWith(
        "reInit",
        expect.any(Function)
        );
    });

    it("Deve chamar scrollNext", () => {
        const { result } = renderHook(() =>
        useCarouselState()
        );

        act(() => {
            result.current.scrollNext();
        });

        expect(scrollNext)
        .toHaveBeenCalledTimes(1);
    });

    it("Deve chamar scrollPrev", () => {
        const { result } = renderHook(() =>
        useCarouselState()
        );

        act(() => {
            result.current.scrollPrev();
        });

        expect(scrollPrev)
        .toHaveBeenCalledTimes(1);
    });

    it("Deve navegar para um slide específico", () => {
        const { result } = renderHook(() =>
            useCarouselState()
        );
        act(() => {
            result.current.scrollTo(2);
        });


        expect(scrollTo)
        .toHaveBeenCalledWith(2);

    });



    it("Deve retornar o carouselRef vindo do Embla", () => {
        const ref = vi.fn();

        vi.mocked(useEmblaCarousel)
        .mockReturnValue([
            ref,
            mockApi as EmblaCarouselType
        ]);

        const { result } = renderHook(() =>
        useCarouselState()
        );

        expect(
        result.current.carouselRef
        ).toBe(ref);

    });

    it("Não deve quebrar quando a API não existir", () => {
        vi.mocked(useEmblaCarousel)
        .mockReturnValue([
            vi.fn(),
            undefined
        ]);

        expect(() =>
        renderHook(() =>
            useCarouselState()
        )
        ).not.toThrow();
    });

});
import { act, renderHook } from "@testing-library/react";
import useEmblaCarousel from "embla-carousel-react";
import { describe, vi } from "vitest";
import { useCarouselState } from "./useCarouselState";
import { EmblaCarouselType } from "embla-carousel";

vi.mock('embla-carousel-react', () => ({
    default: vi.fn(),
}))

describe('useCarouselState', () => {
    const scrollPrev = vi.fn();
    const scrollNext = vi.fn();
    const scrollTo = vi.fn();

    const mockApi: Partial<EmblaCarouselType> = {
        selectedScrollSnap: vi.fn(() => 0),
        canScrollPrev: vi.fn(() => false),
        canScrollNext: vi.fn(() => true),
        scrollSnapList: vi.fn(() => [0,1,2]),
        scrollPrev,
        scrollNext,
        scrollTo,
        on: vi.fn(),
        off: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useEmblaCarousel).mockReturnValue([
            vi.fn(),
            mockApi as EmblaCarouselType
        ]);
    });

    it("Deve Inicializar o carrousel corretamente", () => {
        const { result } = renderHook(() => 
            useCarouselState()
        );

        expect(result.current.selectedIndex).toBe(0);
        expect(result.current.scrollSnaps).toEqual([0,1,2]);
        expect(result.current.slideCount).toBe(3);
        expect(result.current.canScrollNext).toBe(true);
        expect(result.current.canScrollPrev).toBe(false);
    })

    it("Deve chamar scrollNext", () => {
        const { result } = renderHook(() => 
            useCarouselState()
        );

        act(() => {
            result.current.scrollNext();
        });
        expect(scrollNext).toHaveBeenCalledTimes(1);
    })

    it("Deve chamar scrollPrev", () => {
        const { result } = renderHook(() => 
            useCarouselState()
        );

        act(() => {
            result.current.scrollPrev();
        });
        expect(scrollPrev).toHaveBeenCalledTimes(1);
    })

    it("Deve navegar para um slide especifíco", () => {
        const { result } = renderHook(() => 
            useCarouselState()
        );

        act(() => {
            result.current.scrollTo(2)
        })

        expect(scrollTo).toHaveBeenCalledWith(2);
    })
}) 
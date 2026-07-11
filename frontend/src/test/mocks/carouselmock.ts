import { CarouselContextData } from "@/components/ui/Carousel/carouselContext";

export const mockCarouselContext: CarouselContextData = {
    api: undefined,
    carouselRef: () => {},
    selectedIndex: 0,
    scrollSnaps: [0, 1, 2],
    slideCount: 3,
    canScrollPrev: false,
    canScrollNext: true,
    scrollPrev: vi.fn(),
    scrollNext: vi.fn(),
    scrollTo: vi.fn(),
};
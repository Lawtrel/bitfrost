import { createContext } from "react";
import type { EmblaCarouselType } from "embla-carousel";

export interface CarouselContextData {
  api?: EmblaCarouselType;

  carouselRef: (node: HTMLElement | null) => void;

  selectedIndex: number;

  scrollSnaps: number[];

  slideCount: number;

  canScrollPrev: boolean;

  canScrollNext: boolean;

  scrollPrev: () => void;

  scrollNext: () => void;

  scrollTo: (index: number) => void;
}

export const CarouselContext = createContext<CarouselContextData | null>(null);
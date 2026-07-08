import { CarouselContext } from "@/components/ui/Carousel/carouselContext";
import { useContext } from "react";


export function useCarousel() {
  const context = useContext(CarouselContext);

  if (!context) {
    throw new Error(
      "useCarousel deve ser utilizado dentro de um <Carousel />."
    );
  }

  return context;
}
import { useCarousel } from "@/hooks/carousel/useCarouselContext";
import { ChevronLeft } from "lucide-react";
import Button from "../../Button/button";


interface CarouselControlsProps {
  className?: string;

  previousClassName?: string;

  nextClassName?: string;
}

export default function CarouselButtonPrev({
  className,
  previousClassName,
}: CarouselControlsProps) {
    const {
        scrollPrev,
        canScrollPrev,
    } = useCarousel();

  return (
    <div
        className={className}
    >
      <Button
        variant="secondary"
        title="Anterior"
        leftIcon={<ChevronLeft />}
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        className={previousClassName}
      />
    </div>
  );
}
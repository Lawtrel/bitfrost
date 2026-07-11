import { useCarousel } from "@/hooks/carousel/useCarouselContext";
import { ChevronLeft } from "lucide-react";
import Button from "../../button/button";


interface CarouselControlsProps {
  className?: string;
  previousClassName?: string;
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
      data-testid="button-prev-container"
    >
      <Button
        data-testid="button-prev"
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
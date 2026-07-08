import { useCarousel } from "@/hooks/carousel/useCarouselContext";
import { ChevronRight } from "lucide-react";
import Button from "../../Button/button";


interface CarouselControlsProps {
  className?: string;

  previousClassName?: string;

  nextClassName?: string;
}

export default function CarouselButtonNext({
  className,
  nextClassName,
}: CarouselControlsProps) {
    const {
        scrollNext,
        canScrollNext,
    } = useCarousel();

  return (
    <div
        className={className}
    >
      <Button
        variant="primary"
        title="Próximo"
        rightIcon={<ChevronRight />}
        onClick={scrollNext}
        disabled={!canScrollNext}
        className={nextClassName}
      />
    </div>
  );
}
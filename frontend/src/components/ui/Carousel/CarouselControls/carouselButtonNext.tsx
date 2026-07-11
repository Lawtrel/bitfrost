import { useCarousel } from "@/hooks/carousel/useCarouselContext";
import { ChevronRight } from "lucide-react";
import Button from "../../button/button";


interface CarouselControlsProps {
  className?: string;
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
      data-testid="button-next-container"
      className={className}
    >
      <Button
        data-testid="button-next"
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
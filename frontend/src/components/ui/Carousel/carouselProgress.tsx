import { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";
import { useCarousel } from "@/hooks/carousel/useCarouselContext";


interface CarouselProgressProps
  extends HTMLAttributes<HTMLDivElement> {
  className?: string;

  trackClassName?: string;

  progressClassName?: string;

  showPercentage?: boolean;

  percentageClassName?: string;
}

export default function CarouselProgress({
  className,
  trackClassName,
  progressClassName,
  showPercentage = false,
  percentageClassName,
}: CarouselProgressProps) {
  const {
    selectedIndex,
    slideCount,
  } = useCarousel();

  const progress =
    slideCount <= 1
      ? 100
      : ((selectedIndex + 1) / slideCount ) * 100;

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "h-2 w-full overflow-hidden rounded-full bg-zinc-200",
          trackClassName
        )}
      >
        <div
          className={cn(
            "h-full rounded-full bg-indigo-600 transition-all duration-300",
            progressClassName
          )}
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      {showPercentage && (
        <p
          className={cn(
            "mt-2 text-center text-sm font-medium",
            percentageClassName
          )}
        >
          {Math.round(progress)}%
        </p>
      )}
    </div>
  );
}
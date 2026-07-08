import { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";
import { useCarousel } from "@/hooks/carousel/useCarouselContext";


interface CarouselDotsProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;

  dotClassName?: string;

  activeDotClassName?: string;

  size?: "sm" | "md" | "lg";

  gap?: "sm" | "md" | "lg";
}

export default function CarouselDots({
  className,
  dotClassName,
  activeDotClassName,
  size = "md",
  gap = "md",
  ...props
}: CarouselDotsProps) {
  const {
    scrollSnaps,
    selectedIndex,
    scrollTo,
  } = useCarousel();

  const sizes = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  const gaps = {
    sm: "gap-2",
    md: "gap-3",
    lg: "gap-5",
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center",
        gaps[gap],
        className
      )}
    >
      {scrollSnaps.map((_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => scrollTo(index)}
          aria-label={`Ir para slide ${index + 1}`}
          aria-current={selectedIndex === index}
          className={cn(
            "rounded-full transition-all duration-300",

            sizes[size],

            selectedIndex === index
              ? cn(
                  "bg-indigo-600 scale-125",
                  activeDotClassName
                )
              : cn(
                  "bg-zinc-300 hover:bg-zinc-400",
                  dotClassName
                )
          )}
          {...props}
        />
      ))}
    </div>
  );
}
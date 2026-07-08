import {
  forwardRef,
  type HTMLAttributes,
} from "react";

import { cn } from "@/lib/utils";
import { useCarousel } from "@/hooks/carousel/useCarouselContext";


interface CarouselContentProps
  extends HTMLAttributes<HTMLDivElement> {
  viewportClassName?: string;
}

const CarouselContent = forwardRef<
  HTMLDivElement,
  CarouselContentProps
>(
  (
    {
      className,
      viewportClassName,
      children,
      ...props
    },
    ref
  ) => {
    const { carouselRef } = useCarousel();

    return (
      <div
        ref={carouselRef}
        className={cn(
          "overflow-hidden",
          viewportClassName
        )}
      >
        <div
          ref={ref}
          className={cn(
            "flex",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </div>
    );
  }
);

CarouselContent.displayName = "CarouselContent";

export default CarouselContent;
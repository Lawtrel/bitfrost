import {
  forwardRef,
  type HTMLAttributes,
} from "react";

import { cn } from "@/lib/utils";

interface CarouselItemProps extends HTMLAttributes<HTMLDivElement> {
    className: string;
    children: React.ReactNode;
}

const CarouselItem = forwardRef<HTMLDivElement, CarouselItemProps>(
  (
    {
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        role="group"
        aria-roledescription="slide"
        className={cn(
          "min-w-0 shrink-0 grow-0 basis-full",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CarouselItem.displayName = "CarouselItem";

export default CarouselItem;
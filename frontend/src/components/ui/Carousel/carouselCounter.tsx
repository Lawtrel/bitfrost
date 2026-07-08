import { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";
import { useCarousel } from "@/hooks/carousel/useCarouselContext";


interface CarouselCounterProps
  extends HTMLAttributes<HTMLParagraphElement> {
  className?: string;

  separator?: string;

  leadingZero?: boolean;

  prefix?: string;

  suffix?: string;
}

export default function CarouselCounter({
  className,
  separator = "/",
  leadingZero = false,
  prefix = "",
  suffix = "",
  ...props
}: CarouselCounterProps) {
  const {
    selectedIndex,
    slideCount,
  } = useCarousel();

  const current = selectedIndex + 1;

  const format = (value: number) =>
    leadingZero ? value.toString().padStart(2, "0") : value.toString();

  return (
    <p
      className={cn(
        "font-inter text-sm font-medium text-muted-foreground",
        className
      )}
      {...props}
    >
      {prefix}
      {format(current)}
      {" "}
      {separator}
      {" "}
      {format(slideCount)}
      {suffix}
    </p>
  );
}
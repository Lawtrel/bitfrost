import { cn } from "@/lib/utils";

import { CarouselContext } from "./carouselContext";
import { useCarouselState } from "@/hooks/carousel/useCarouselState";
import { HTMLAttributes } from "react";
import { EmblaOptionsType, EmblaPluginType } from "embla-carousel";


interface CarouselProps
  extends HTMLAttributes<HTMLDivElement> {

  children: React.ReactNode;

  options?: EmblaOptionsType;

  plugins?: EmblaPluginType[];
}


export default function Carousel({
 children,
 className,
 options,
 plugins,
 ...props
}: CarouselProps) {


const carousel = useCarouselState({
 options,
 plugins
});


return (

<CarouselContext.Provider value={carousel}>

<div
className={cn(
"relative",
className
)}
{...props}
>

{children}

</div>

</CarouselContext.Provider>

)

}
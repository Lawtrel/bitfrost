import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import useEmblaCarousel from "embla-carousel-react";

import {
  EmblaOptionsType,
  EmblaPluginType,
} from "embla-carousel";


interface UseCarouselStateProps {
  options?: EmblaOptionsType;

  plugins?: EmblaPluginType[];
}


export function useCarouselState({
  options,
  plugins,
}: UseCarouselStateProps = {}) {

  const [
    carouselRef,
    api
  ] = useEmblaCarousel(
    options,
    plugins
  );

  const [
    selectedIndex,
    setSelectedIndex
  ] = useState(0);

  const [
    scrollSnaps,
    setScrollSnaps
  ] = useState<number[]>([]);

  const [
    canScrollPrev,
    setCanScrollPrev
  ] = useState(false);

  const [
    canScrollNext,
    setCanScrollNext
  ] = useState(false);

  const onSelect = useCallback(() => {

    if (!api) return;

    setSelectedIndex(
      api.selectedScrollSnap()
    );

    setCanScrollPrev(
      api.canScrollPrev()
    );

    setCanScrollNext(
      api.canScrollNext()
    );

  }, [api]);



  const scrollPrev = useCallback(() => {

    api?.scrollPrev();

  }, [api]);

  const scrollNext = useCallback(() => {

    api?.scrollNext();

  }, [api]);

  const scrollTo = useCallback(
    (index:number)=>{

      api?.scrollTo(index);

    },
    [api]
  );



  useEffect(()=>{

    if(!api) return;


    setScrollSnaps(
      api.scrollSnapList()
    );


    onSelect();


    api.on(
      "select",
      onSelect
    );


    api.on(
      "reInit",
      onSelect
    );



    return ()=>{

      api.off(
        "select",
        onSelect
      );


      api.off(
        "reInit",
        onSelect
      );

    };


  },[
    api,
    onSelect
  ]);



  return useMemo(()=>({

    api,

    carouselRef,

    selectedIndex,

    scrollSnaps,

    canScrollPrev,

    canScrollNext,

    slideCount:
      scrollSnaps.length,


    scrollPrev,

    scrollNext,

    scrollTo,


  }),[
    api,
    carouselRef,
    selectedIndex,
    scrollSnaps,
    canScrollPrev,
    canScrollNext,
    scrollPrev,
    scrollNext,
    scrollTo
  ]);

}
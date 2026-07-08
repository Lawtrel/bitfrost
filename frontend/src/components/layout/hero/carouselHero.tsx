import { Carousel, CarouselButtonNext, CarouselButtonPrev, CarouselContent, CarouselItem } from "@/components/ui/Carousel";


export default function CarouselHero () {
    return(
        <Carousel className='w-[1700px] flex items-center justify-center bg-black h-auto rounded-[40px]'>
            <CarouselButtonPrev className='flex mr-5'previousClassName='p-2'  />
            <CarouselContent className="w-[1400px]">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                    <CarouselItem
                        key={item}
                        className="basis-1/4"
                    >
                    <div className="flex h-52 m-8 w-[280px] items-center justify-center rounded-3xl border bg-card shadow-lg">
                        <span className="text-2xl font-bold">
                        Card {item}
                        </span>
                    </div>
                </CarouselItem>
                ))}
        </CarouselContent>
            <CarouselButtonNext className='flex ml-5' nextClassName='p-2'/>
      </Carousel>
    )
}
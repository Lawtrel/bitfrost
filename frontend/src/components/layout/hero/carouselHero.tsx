import { Carousel, CarouselButtonNext, CarouselButtonPrev, CarouselContent, CarouselItem } from "@/components/ui/Carousel";
import { heroCards } from "./heroCards";
import { Card } from "@/components/ui/card/card";


export default function CarouselHero () {
    return(
        <Carousel className='w-[1700px] flex items-center justify-center bg-blue-800 h-auto rounded-[40px]'>
            <CarouselButtonPrev className='flex mr-5'previousClassName='p-2'  />
            <CarouselContent className="w-[1400px]">
                {heroCards.map((heroCard) => {
                    const Icon = heroCard.icon;
                    return(
                    <CarouselItem
                        key={heroCard.id}
                        className="basis-1/4"
                    >
                        <Card 
                            className="h-[200px] w-[300px] m-8" 
                            titleClassName="text-white group-hover:text-black w-[150px]" 
                            cardTitle={heroCard.title} 
                            cardDescription={heroCard.description} 
                            iconClassName="w-[50px] h-[50px]" 
                            cardIcon={<Icon className=" group-hover:text-blue-800 text-white" />}  
                            />
                    </CarouselItem>
                    )
                })}
            </CarouselContent>
            <CarouselButtonNext className='flex ml-5' nextClassName='p-2'/>
        </Carousel>
    )
}
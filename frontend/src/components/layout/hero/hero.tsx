import MainText from './mainText';
import ApresentationHero from './apresentationHero';
import CarouselHero from './carouselHero';

export default function Hero () {

    return (
        <>
            <section aria-label="Hero" className="relative flex flex-col pb-[80px] overflow-hidden justify-center w-full gap-8 items-center border-b border-indigo-400">
                <img className="absolute h-auto inset-0 object-cover z-[-1] w-full" src="/assets/Hero Bifrost.png" alt="Imagem de fundo do Hero" />
                <div className="flex w-full justify-around items-center px-4">
                    <MainText />
                    <ApresentationHero />
                </div>
                <CarouselHero />
            </section>
        </>
    )
}
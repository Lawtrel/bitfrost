import MainText from './mainText';
import ApresentationHero from './apresentationHero';
import CarouselHero from './carouselHero';

export default function Hero () {

    return (
        <>
            <main className="relative flex flex-col h-auto justify-center w-full gap-8 items-center">
                <div className="flex w-full justify-around items-center px-4">
                    <MainText />
                    <ApresentationHero />
                </div>
                    <img className="absolute z-[-1] w-full" src="/assets/Hero Bifrost.png" alt="Imagem de fundo do Hero" />
                <CarouselHero />
            </main>
        </>
    )
}
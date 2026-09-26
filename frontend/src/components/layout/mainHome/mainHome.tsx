import HowItWorksHome from "./howItWorksHome";
import Partners from "./partners";
import RoiCalculator from "./roiCalculator/roiCalculator";

export default function MainHome () {
    return(
        <main className="relative w-full overflow-hidden">
            <img className="absolute inset-0 object-cover z-[-1] w-full" src="/assets/Background Main.png" alt="Imagem de fundo da seção principal" />
            <section>
                <Partners />
            </section>
            <section>
                <HowItWorksHome />
            </section>
            <section className=" bg-slate-900 w-full">
                <RoiCalculator />
            </section>
        </main>
    )
}
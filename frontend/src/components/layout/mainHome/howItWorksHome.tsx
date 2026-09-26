import { Card } from "@/components/ui/card/card";
import { howItWorksList } from "./howItWorksHomeList";
import { MoveRight } from "lucide-react";
import { useState } from "react";

export default function HowItWorksHome () {
    const [activeStep, setActiveStep] = useState<number>(-1);
    return(
        <div className="flex flex-col items-center justify-center gap-8 w-full mb-[40px]">
            <div className="flex flex-col items-center justify-center gap-8">
                <h2 className="font-inter font-bold w-[600px] text-4xl mt-8">Como funciona o Ecossistema</h2>
                <p className="font-inter text-2xl text-center w-[1050px] text-gray-400">Cinco etapas fluidas para transformar sua logística tradicional em uma operação digitalizada, rastreável e 100% auditável.</p>
            </div>
            <div className="flex gap-0">
                {howItWorksList.map((howList, index) => {
                    const Icon = howList.icon
                    return(
                        <div className="flex gap-0" key={howList.id}  onMouseEnter={() => setActiveStep(index)} onMouseLeave={() => setActiveStep(-1)}>
                            <Card
                                className="bg-white hover:border-blue-400 items-start w-[300px]"
                                titleClassName="group-hover:text-blue-400 w-full text-end pr-8 text-inter"
                                cardTitle={`0${howList.id}`}
                                cardSubtitle={howList.title}
                                descriptionClassName="text-black pb-8"
                                cardDescription={howList.subtitle}
                                iconClassName="p-4 text-blue-400 bg-opacity-10 group-hover:text-white group-hover:bg-blue-400"
                                cardIcon={<Icon /> }
                                cardFooter={
                                    <div className="border-t-2 border-t-gray-300 w-full pt-2 flex justify-between">
                                        <div className="text-gray-400">
                                            Passo {howList.id} de {howItWorksList.length}
                                        </div>
                                        <MoveRight className="h-4 text-gray-400 group-hover:text-blue-400 group-hover:h-5" />
                                    </div>
                                }
                                footerClassName="font-inter text-sm"
                            />
                            {index < howItWorksList.length - 1 && (
                                <div
                                    data-testid="connector"
                                    className={`w-[50px] h-0 mt-[80px] border ${
                                        index < activeStep
                                            ? "border-blue-400"
                                            : "border-gray-300"
                                    }`}
                                />
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
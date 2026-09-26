import { Card } from "@/components/ui/card/card";
import { partnersList } from "./partnersList";

export default function Partners () {
    return(
        <div className="flex flex-col mt-[40px] mb-[40px] gap-8 items-center justify-center">
            <h2 className="font-inter font-bold text-4xl mt-8">Quem confia no {''} <span className="text-indigo-500">Vale Pallet</span></h2>
            <div className="bg-white border rounded-[30px] shadow-md p-8 flex justify-center w-[90%]">
                {partnersList.map((partner) => (
                    <Card
                        key={partner.id}
                        className="w-[280px] h-[200px] border-purple-500 bg-gradient-to-br from-purple-900 to-indigo-600 hover:bg-gradient-to-br hover:from-purple-800 hover:to-indigo-400"
                        cardDescription={partner.description}
                        descriptionClassName="font-inter font-bold"
                        iconClassName="bg-white bg-opacity-100 p-4 flex items-center justify-center"
                        cardIcon={
                            <img
                                src={partner.logo}
                                alt={`Logo ${partner.name}`}
                                className="h-12 w-auto"
                            />
                        }
                    />
                ))}
            </div>
        </div>
    )
}
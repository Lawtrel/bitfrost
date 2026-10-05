import Button from "@/components/ui/Button/button";
import { useState } from "react";
import { UseFormRegister } from "react-hook-form";
import { RoiCalculatorSchema } from "./roiCalculatorSchema";

interface RoiCalculatorFormServiceProps {
    register: UseFormRegister<RoiCalculatorSchema>;
    value: "both" | "dev" | "maintenance";
    selectedService: string;
    onSelect: (service: "both" | "dev" | "maintenance") => void;
}


export default function RoiCalculatorFormService({register, value, selectedService, onSelect}: RoiCalculatorFormServiceProps) {
    return(
        <label>
            <Button
                type="button"
                onClick={() => onSelect(value)}
                className={`w-[180px] rounded-xl h-[80px] flex p-2 
                ${selectedService === value ? 
                'border-cyan-500 bg-cyan-500/10 text-white': 
                    'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                }`
                }
            >
                <input
                    className="sr-only"
                    type="radio"
                    value={value}
                    {...register("service")}
                    />
                {value === "both" && "Desenvolvimento + Manutenção"}
                {value === "dev" && "Somente Desenvolvimento"}
                {value === "maintenance" && "Somente Manutenção"}
            </Button>
        </label>
    )
}
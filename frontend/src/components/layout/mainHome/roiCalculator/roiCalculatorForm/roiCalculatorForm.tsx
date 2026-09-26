import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "@/components/ui/button/button";
import { roiCalculatorSchema, RoiCalculatorSchema } from "./roiCalculatorSchema";
import { useState } from "react";
import RoiCalculatorFormService from "./roiCalculatorFormService";
import RoiCalculatorFormField from "./roiCalculatorFormField";

interface RoiCalculatorFormProps {
    onSubmit: (data: RoiCalculatorSchema) => void;
}



export default function RoiCalculatorForm({onSubmit}: RoiCalculatorFormProps) {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<RoiCalculatorSchema>({
        resolver: zodResolver(roiCalculatorSchema),
        defaultValues: {
            companyName: "Minha empresa",
            vouchersPerYear: 1000000,
            vouchersCosts: 8,
            palletsPerTruck: 26,
            palletsCosts: 50,
            service: "both",
            years: 5,
        },
    });

    const [serviceType, setServiceType] = useState<'dev' | 'maintenance' | 'both'>('both');

    return (
        <form
            data-testid="roi-form"
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-8 w-[650px] font-inter text-white pt-[40px] pb-[40px]"
        >
            {/* Nome da empresa */}
            <RoiCalculatorFormField 
                id="companyName"
                label="Nome da Empresa:"
                placeholder="Minha empresa"
                register={register}
                error={errors.companyName}
            />
            {/* Quantidade de vales */}
            <RoiCalculatorFormField
                id="vouchersPerYear"
                label="Quantidade de vales pallets por ano (Unidades):"
                placeholder="1000000"
                type="number"
                register={register}
                error={errors.vouchersPerYear}
            />
            {/* Valor de emissão do vale */}
            <RoiCalculatorFormField 
                id="vouchersCosts"
                label="Valor da unidade do vale em papel (em R$):"
                placeholder="10"
                type="number"
                register={register}
                error={errors.vouchersCosts}
            />
            {/* Quantidade de pallets por caminhão */}
            <RoiCalculatorFormField 
                id="palletsPerTruck"
                label="Quantidade de pallets que um caminhão carrega (Unidades):"
                placeholder="26"
                type="number"
                register={register}
                error={errors.palletsPerTruck}
            />
            {/* Custo por pallet perdido */}
            <RoiCalculatorFormField 
                id="palletsCosts"
                label="Custo de cada pallet (R$):"
                placeholder="50"
                type="number"
                register={register}
                error={errors.palletsCosts}
            />
            {/* Tempo que deseja manter do serviço */}
            <RoiCalculatorFormField 
                id="years"
                label="Quantidade de anos que planeja manter o serviço:"
                placeholder="5"
                type="number"
                register={register}
                error={errors.years}
            />
            {/* Tipo de serviço */}
            <div className="flex flex-col gap-3 justify-center items-center">
                <label className="font-semibold">
                    Serviço desejado:
                </label>
                <div className="flex gap-3">
                    <RoiCalculatorFormService 
                        register={register}
                        value="both"
                        selectedService={serviceType}
                        onSelect={(value) => {
                            setServiceType(value);
                            setValue("service", value);
                        }}
                    />
                    <RoiCalculatorFormService 
                        register={register}
                        value="dev"
                        selectedService={serviceType}
                        onSelect={(value) => {
                            setServiceType(value);
                            setValue("service", value);
                        }}
                    />
                    <RoiCalculatorFormService 
                        register={register}
                        value="maintenance"
                        selectedService={serviceType}
                        onSelect={(value) => {
                            setServiceType(value);
                            setValue("service", value);
                        }}
                    />
                    {errors.service && (
                        <span>{errors.service.message}</span>
                    )}
                </div>
            </div>
            <Button
                variant="primary"
                size="lg"
                type="submit"
            >
                Calcular ROI
            </Button>
        </form>
    );
}
import { z } from "zod";
import { SERVICE_TYPES } from "./serviceTypes";

export const roiCalculatorSchema = z.object({
    companyName: z.string().min(2, "Informe o nome da empresa.").max(50, "O nome da empresa é muito longo."),

    vouchersPerYear: z.number({
            required_error: "Informe a quantidade de vales pallets.",
            invalid_type_error: "Digite um número válido.",
        }).min(1, "A quantidade deve ser maior que zero."),
    vouchersCosts: z.number({
            required_error: "Informe o valor de emissão do vale.",
            invalid_type_error: "Digite um número válido.",
        }).min(1, "A quantidade deve ser maior que zero."),
    palletsPerTruck: z.number({
            required_error: "Informe a quantidade de pallets que um caminhão carrega.",
            invalid_type_error: "Digite um número válido.",
        }).min(1, "A quantidade deve ser maior que zero."),
    palletsCosts: z.number({
            required_error: "Informe o valor de cada pallet.",
            invalid_type_error: "Digite um número válido.",
        }).min(1, "A quantidade deve ser maior que zero."),
    service: z.enum([
        SERVICE_TYPES.COMPLETE,
        SERVICE_TYPES.DEVELOPMENT,
        SERVICE_TYPES.MAINTENANCE,
    ]),
    years: z.number({
        required_error: "Informe quantos anos planeja se manter conosco",
        invalid_type_error: "Digite um número válido.",
    }).min(1, "A quantidade deve ser maior que zero.")
});

export type RoiCalculatorSchema = z.infer<typeof roiCalculatorSchema>;
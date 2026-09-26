import { describe, expect, it } from "vitest";
import { roiCalculatorSchema } from "./roiCalculatorSchema";
import { SERVICE_TYPES } from "./serviceTypes";

describe("roiCalculatorSchema", () => {
    const validData = {
        companyName: "Vale Pallet",
        vouchersPerYear: 100000,
        vouchersCosts: 8,
        palletsPerTruck: 26,
        palletsCosts: 50,
        service: SERVICE_TYPES.COMPLETE,
        years: 5,
    };

    it("Deve validar um formulário válido", () => {
        const result = roiCalculatorSchema.safeParse(validData);

        expect(result.success).toBe(true);
    });

    it("Deve rejeitar nome da empresa com menos de 2 caracteres", () => {
        const result = roiCalculatorSchema.safeParse({
            ...validData,
            companyName: "A",
        });

        expect(result.success).toBe(false);
    });

    it("Deve rejeitar quantidade de vales menor ou igual a zero", () => {
        const result = roiCalculatorSchema.safeParse({
            ...validData,
            vouchersPerYear: 0,
        });

        expect(result.success).toBe(false);
    });

    it("Deve rejeitar valor do vale menor ou igual a zero", () => {
        const result = roiCalculatorSchema.safeParse({
            ...validData,
            vouchersCosts: 0,
        });

        expect(result.success).toBe(false);
    });

    it("Deve rejeitar quantidade de pallets por caminhão menor ou igual a zero", () => {
        const result = roiCalculatorSchema.safeParse({
            ...validData,
            palletsPerTruck: 0,
        });

        expect(result.success).toBe(false);
    });

    it("Deve rejeitar custo do pallet menor ou igual a zero", () => {
        const result = roiCalculatorSchema.safeParse({
            ...validData,
            palletsCosts: 0,
        });

        expect(result.success).toBe(false);
    });

    it("Deve rejeitar quantidade de anos menor ou igual a zero", () => {
        const result = roiCalculatorSchema.safeParse({
            ...validData,
            years: 0,
        });

        expect(result.success).toBe(false);
    });

    it("Deve rejeitar um tipo de serviço inválido", () => {
        const result = roiCalculatorSchema.safeParse({
            ...validData,
            service: "inexistente",
        });

        expect(result.success).toBe(false);
    });
});
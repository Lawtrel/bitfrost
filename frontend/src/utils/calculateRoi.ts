export type ServiceType =
    | "both"
    | "dev"
    | "maintenance";

export interface CalculateRoiInput {
    vouchersPerYear?: number;
    vouchersCosts?: number;
    palletsPerTruck?: number;
    palletsCosts?: number;
    years?: number;
    service?: "both" | "dev" | "maintenance";
}

export interface CalculateRoiResult {
    totalSavings: number;
    totalLossCostWithValePallet: number;
    totalPalletLossCost: number;
    totalVoucherLossCosts: number;
    totalLossCost: number;
    implementationCost: number;
    maintenanceCost: number;
    totalInvestment: number;
    paybackMonths: number;
    roi: number;
    recommendation: string;
}

const SERVICE_PRICES = {
    implementation: (3682400 / 12 * 18 + 1000000 + 1270000 + 260000 + 1600000) + ((3682400 / 12 * 18 + 1000000 + 1270000 + 260000 + 1600000 + 2060400) *(1 + 0.15)),
    maintenance: 2060400,
};

const LOSS_REDUCTION = 0.99;
const AVERAGE_LOSS_RATE = 0.05;


export function calculateRoi({
    vouchersPerYear,
    palletsCosts,
    palletsPerTruck,
    vouchersCosts,
    service,
    years,
}: CalculateRoiInput): CalculateRoiResult {

    const palletLossCost =
        palletsCosts * palletsPerTruck;

        
    const annualLoss =
        vouchersPerYear * AVERAGE_LOSS_RATE;

    const totalPalletLossCost =
        (palletLossCost * annualLoss) * years;
    
    const totalVoucherLossCosts =
        annualLoss * vouchersCosts * years
    const annualLossCost =
        (annualLoss * vouchersCosts) + (palletLossCost * annualLoss);

    const totalLossCost = annualLossCost * years;

    const annualLossWithValePallet =
        annualLoss * (1 - LOSS_REDUCTION);

    const annualLossCostWithValePallet =
        (annualLossWithValePallet * vouchersCosts) + (palletLossCost * annualLossWithValePallet);

    const totalLossCostWithValePallet =
        annualLossCostWithValePallet * years

    const annualSavings =
        annualLossCost - annualLossCostWithValePallet;
    
    const monthlySavings = annualSavings / 12;

    const totalSavings = annualSavings * years;

    let implementationCost = 0;
    let maintenanceCost = 0;

    switch (service) {
        case "both":
            implementationCost = SERVICE_PRICES.implementation;
            maintenanceCost = SERVICE_PRICES.maintenance + 1000000 + 1600000 * years;
            break;

        case "dev":
            implementationCost = SERVICE_PRICES.implementation;
            break;

        case "maintenance":
            maintenanceCost = SERVICE_PRICES.maintenance + 1000000 * years ;
            break;
    }

    const totalInvestment = implementationCost + maintenanceCost;

    const paybackMonths =
        monthlySavings > 0
            ? (totalInvestment / monthlySavings + 18)
            : Infinity;

    const roi =
        totalInvestment > 0
            ? ((totalSavings- totalInvestment) / totalInvestment) * 100
            : 0;

    let recommendation = "";

    if(paybackMonths > years * 12 ) {
        recommendation =
            "Com os dados informados, o investimento não apresenta retorno financeiro.";
    } else if (roi >= 300) {
        recommendation =
            "Excelente investimento. O retorno financeiro é muito elevado.";
    } else if (roi >= 100) {
        recommendation =
            "O investimento apresenta ótimo retorno financeiro.";
    } else if (roi >= 0) {
        recommendation =
            "O investimento tende a compensar ao longo do tempo.";
    } else {
        recommendation =
            "Com os dados informados, o investimento não apresenta retorno financeiro.";
    }

    return {
        totalLossCostWithValePallet,
        totalPalletLossCost,
        totalVoucherLossCosts,
        totalLossCost,
        totalSavings,
        implementationCost,
        maintenanceCost,
        totalInvestment,
        paybackMonths,
        roi,
        recommendation,
    };
}
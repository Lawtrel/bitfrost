import { RoiCalculatorSchema } from "@/components/layout/mainHome/roiCalculator/roiCalculatorForm/roiCalculatorSchema";
import { calculateRoi } from "@/utils/calculateRoi";
import { useMemo } from "react";




export function useRoiCalculator(data: RoiCalculatorSchema) {
    const result = useMemo(() => {
        return calculateRoi(data);
    }, [data]);

    return result;
}
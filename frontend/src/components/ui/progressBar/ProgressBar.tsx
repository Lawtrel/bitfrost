import  "./ProgressBar.css"
import { cn } from "@/lib/utils";

interface ProgressBarProps {
    progress: number
    className?: string
    showPercentage?: boolean
    "data-testid"?: string;
}

export default function ProgressBar ({progress, className, showPercentage = true, "data-testid": dataTestId}: ProgressBarProps) {
    const percentage = Math.round(Math.min(progress, 100));
    return(
        <div role="progressbar" className={cn("w-full", className)}>
            <div className="mb-2 flex justify-between items-center">
                <span className="text-md font-bold text-indigo-400">
                Carregando...
                </span>

                {showPercentage && (
                    <span className="text-md font-bold text-black-400">
                        {percentage}%
                    </span>
                )}
            </div>
            <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                    data-testid={dataTestId}
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-700 transition-all duration-500 ease-out"
                    style={{ width: `${Math.min(progress, 100)}%`}}
                    />
            </div>
            {/* Brilho */}
            <div className="absolute inset-0 loading-shine" />
        </div>
    )
}
interface RoiAnalysisProps {
    recommendation: string;
}

export default function RoiAnalysis({
    recommendation,
}: RoiAnalysisProps) {
    return (
        <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/5 p-6">
            <h4 className="mb-2 text-xl font-bold">
                Nossa análise
            </h4>

            <p className="leading-relaxed">
                {recommendation}
            </p>
        </div>
    );
}
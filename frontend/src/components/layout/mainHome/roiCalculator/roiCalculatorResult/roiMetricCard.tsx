interface RoiMetricCardProps {
    title: string;
    value: string;
    valueClassName?: string;
}

export default function RoiMetricCard({
    title,
    value,
    valueClassName,
}: RoiMetricCardProps) {
    return (
        <div className="rounded-xl border p-5">
            <span className="text-sm text-muted-foreground">
                {title}
            </span>

            <p className={`mt-2 text-2xl font-bold ${valueClassName}`}>
                {value}
            </p>
        </div>
    );
}
import clsx from "clsx";

const QuickSpecsList = ({ specs }: { specs: { label: string; value: string }[] }) => (
    <dl className="rounded-xl border border-base-200 overflow-hidden">
        {specs.map(({ label, value }, i) => (
            <div key={i} className={clsx(
                "flex items-center px-4 py-2",
                i % 2 === 0 ? "bg-base-200/30" : "bg-base-100"
            )}>
                <dt className="w-2/5 text-[11px] font-bold text-base-content/50 uppercase tracking-wider">{label}</dt>
                <dd className="w-3/5 text-sm font-semibold text-base-content truncate">{value}</dd>
            </div>
        ))}
    </dl>
);

export default QuickSpecsList;

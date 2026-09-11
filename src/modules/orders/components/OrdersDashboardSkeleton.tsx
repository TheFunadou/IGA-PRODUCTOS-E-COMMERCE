import type { OrderDashboardView } from "../OrdersTypes";

const SkeletonListCard = () => (
    <div className="w-full rounded-3xl bg-base-100 border border-base-300 p-5 flex flex-col gap-4 animate-pulse">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
                <div className="h-7 w-40 rounded-lg bg-base-200" />
                <div className="h-5 w-24 rounded-full bg-base-200" />
            </div>
            <div className="hidden sm:block h-3 w-44 rounded bg-base-200" />
        </div>
        <div className="flex flex-col gap-3 rounded-2xl bg-base-200/40 p-3">
            <div className="flex flex-col gap-2">
                <div className="h-4 w-3/4 rounded bg-base-200" />
                <div className="h-3 w-1/2 rounded bg-base-200" />
                <div className="h-3 w-2/3 rounded bg-base-200" />
            </div>
            <div className="h-px w-full bg-base-300" />
            <div className="flex items-center justify-between gap-2">
                <div className="h-3 w-28 rounded bg-base-200" />
                <div className="flex gap-1.5">
                    {Array.from({ length: 5 }).map((_, idx) => (
                        <div key={idx} className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-base-200 shrink-0" />
                    ))}
                </div>
            </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="flex flex-col gap-2">
                    <div className="h-3 w-20 rounded bg-base-200" />
                    <div className="h-5 w-24 rounded bg-base-200" />
                </div>
            ))}
        </div>
    </div>
);

const SkeletonGridCard = () => (
    <div className="w-full rounded-3xl bg-base-100 border border-base-300 p-4 flex flex-col gap-3 animate-pulse">
        <div className="flex flex-col gap-2">
            <div className="h-4 w-full rounded bg-base-200" />
            <div className="h-3 w-2/3 rounded bg-base-200" />
            <div className="h-5 w-24 rounded-full bg-base-200" />
        </div>
        <div className="h-4 w-3/4 rounded bg-base-200" />
        <div className="flex items-center justify-between gap-2">
            <div className="h-3 w-20 rounded bg-base-200" />
            <div className="flex gap-1.5">
                {Array.from({ length: 4 }).map((_, idx) => (
                    <div key={idx} className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-base-200 shrink-0" />
                ))}
            </div>
        </div>
        <div className="h-6 w-28 rounded bg-base-200 mt-auto" />
    </div>
);

const OrdersDashboardSkeleton = ({ view }: { view: OrderDashboardView }) => {
    if (view === "grid") {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, idx) => (
                    <SkeletonGridCard key={idx} />
                ))}
            </div>
        );
    }
    return (
        <div className="flex flex-col gap-5">
            {Array.from({ length: 3 }).map((_, idx) => (
                <SkeletonListCard key={idx} />
            ))}
        </div>
    );
};

export default OrdersDashboardSkeleton;
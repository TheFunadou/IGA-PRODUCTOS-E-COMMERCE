
const OrderSkeleton = () => {
    return (
        <div className="w-full rounded-3xl bg-base-100 border border-base-300 overflow-hidden shadow-sm animate-pulse">
            {/* Header Skeleton */}
            <div className="px-5 py-4 bg-base-200/50 border-b border-base-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-2">
                        <div className="h-3 w-20 skeleton rounded" />
                        <div className="h-8 w-36 skeleton rounded-lg" />
                    </div>
                </div>
                <div className="h-8 w-24 skeleton rounded-lg" />
            </div>

            {/* Body Skeleton */}
            <div className="p-5 flex flex-col gap-5">
                {/* Item Card Skeleton */}
                <div className="w-full rounded-2xl border border-base-300 p-4 flex gap-4">
                    <div className="w-20 h-20 sm:w-28 sm:h-28 skeleton rounded-xl flex-shrink-0" />
                    <div className="flex-1 flex flex-col gap-3">
                        <div className="h-6 w-3/4 skeleton rounded" />
                        <div className="h-4 w-1/2 skeleton rounded" />
                        <div className="flex justify-between items-center mt-auto">
                            <div className="h-8 w-20 skeleton rounded" />
                            <div className="h-8 w-24 skeleton rounded" />
                        </div>
                    </div>
                </div>

                <div className="h-px bg-base-200" />

                {/* Footer Skeleton */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-end">
                    <div className="flex flex-col gap-2">
                        <div className="h-3 w-16 skeleton rounded" />
                        <div className="h-12 w-full skeleton rounded-2xl" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="h-3 w-24 skeleton rounded" />
                        <div className="h-4 w-32 skeleton rounded" />
                        <div className="h-3 w-20 skeleton rounded" />
                    </div>
                    <div className="hidden md:flex flex-col gap-2">
                        <div className="h-3 w-20 skeleton rounded" />
                        <div className="h-4 w-24 skeleton rounded" />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <div className="h-3 w-20 skeleton rounded" />
                        <div className="h-8 w-32 skeleton rounded" />
                    </div>
                </div>
            </div>
        </div>
    )
};

export default OrderSkeleton;

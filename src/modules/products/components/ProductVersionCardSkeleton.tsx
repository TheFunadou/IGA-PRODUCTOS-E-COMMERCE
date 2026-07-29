

const ProductVersionCardSkeleton = () => {
    return (
        <div className="relative flex flex-col rounded-2xl overflow-hidden border border-base-200 bg-base-100 w-full h-auto">
            <div className="relative w-full overflow-hidden aspect-square bg-base-200">
                <div className="skeleton w-full h-full rounded-none" />
                <div className="absolute top-2 left-2 skeleton w-16 h-5 rounded-full" />
                <div className="absolute bottom-2 right-2 skeleton w-8 h-8 rounded-full" />
            </div>
            <div className="flex flex-col flex-1 gap-1.5 px-3 py-2.5">
                <div className="space-y-1.5">
                    <div className="skeleton h-3 w-full rounded-md" />
                    <div className="skeleton h-3 w-3/4 rounded-md" />
                </div>
                <div className="flex gap-1 mt-1">
                    <div className="skeleton h-4 w-14 rounded-full" />
                    <div className="skeleton h-4 w-20 rounded-full" />
                    <div className="skeleton h-4 w-16 rounded-full" />
                </div>
                <div className="flex gap-1.5 mt-1">
                    <div className="skeleton w-4 h-4 rounded-full" />
                    <div className="skeleton w-4 h-4 rounded-full" />
                    <div className="skeleton w-4 h-4 rounded-full" />
                    <div className="skeleton w-4 h-4 rounded-full" />
                </div>
                <div className="mt-auto pt-2">
                    <div className="skeleton h-6 w-20 rounded-md mb-2" />
                    <div className="flex gap-2">
                        <div className="skeleton h-9 flex-1 rounded-xl" />
                        <div className="skeleton h-9 w-10 rounded-xl" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductVersionCardSkeleton;
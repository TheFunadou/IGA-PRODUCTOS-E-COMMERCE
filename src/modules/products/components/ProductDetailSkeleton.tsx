
const ProductDetailSkeleton = () => {
    return (
        <div className="w-full px-5 py-10 rounded-xl bg-base-300">
            <div className="w-full flex border-b border-gray-400 pb-5">
                <div className="w-30/100 relative">
                    <div className="sticky top-5">
                        <div className="w-full bg-gray-300 h-130 skeleton">
                        </div>
                        <div className="[&_div]:bg-gray-300 flex gap-2 items-center justify-start flex-wrap mt-5">
                            <div className="w-30 h-30 skeleton" />
                            <div className="w-30 h-30 skeleton" />
                            <div className="w-30 h-30 skeleton" />
                            <div className="w-30 h-30 skeleton" />
                        </div>
                    </div>
                </div>
                <div className="w-50/100 px-10">
                    <div className="[&_div]:bg-gray-300 flex flex-col">
                        <div className="skeleton w-full p-15" />
                        <div className="skeleton w-full p-5 mt-4"></div>
                        <div className="skeleton w-1/4 p-4 mt-5"></div>
                        <div className="skeleton w-1/4 p-10 mt-5"></div>
                        <div className="skeleton w-1/4 p-5 mt-5"></div>
                        <div className="skeleton w-1/4 p-5 mt-5"></div>
                        <div className="skeleton w-1/4 p-5 mt-5"></div>
                    </div>
                    <div className="w-ful flex flex-wrap gap-5 mt-5 [&_div]:bg-gray-300">
                        <div className="w-25 h-35 p-2 skeleton"></div>
                        <div className="w-25 h-35 p-2 skeleton"></div>
                        <div className="w-25 h-35 p-2 skeleton"></div>
                        <div className="w-25 h-35 p-2 skeleton"></div>

                    </div>

                    {/* Description */}

                </div>
                <div className="w-20/100">
                    <div className="w-full bg-base-200 shadow-2xl rounded-xl p-5">
                        <div className="border-b border-gray-400 pb-2">
                            <div className="skeleton p-2 w-1/2 bg-gray-300"></div>
                            <div className="skeleton p-5 w-1/2 mt-3 bg-gray-300"></div>
                        </div>
                        <div className="border-b border-gray-400 py-3">
                            <div className="skeleton p-3 w-1/2 bg-gray-300"></div>
                            <div className="skeleton p-5 w-1/2 mt-3 bg-gray-300"></div>
                        </div>
                        <div className="py-5 flex flex-col gap-6">
                            <div className="skeleton p-3 bg-gray-300 w-1/2"></div>
                            <div className="skeleton p-5 w-full bg-gray-300"></div>
                            <div className="flex flex-col gap-5">
                                <div className="skeleton p-5 bg-gray-300 w-full"></div>
                                <div className="skeleton p-5 bg-gray-300 w-full"></div>
                            </div>
                            <div className="">
                                <div className="skeleton p-3 bg-gray-300 w-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ProductDetailSkeleton;
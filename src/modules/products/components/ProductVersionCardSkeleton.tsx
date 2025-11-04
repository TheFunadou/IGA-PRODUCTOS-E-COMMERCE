

const ProductVersionCardSkeleton = () => {
    return (
        <div className={`w-100 h-160 bg-white p-5 shadow-xl rounded-xl`}>
            <div className="w-full h-full">
                <div className=" h-1/5 py-4 flex flex-col gap-2 justify-center">
                    <div className="skeleton w-full p-8"></div>
                    <div className="skeleton w-full p-5"></div>

                </div>
                <figure className="py-4 relative">
                    <div className="skeleton h-full py-40"></div>
                </figure>
                <div className="flex flex-col justify-center">
                    <div className="skeleton w-1/2 p-6"></div>
                    <div className="mt-2 flex items-center gap-3 [&_button]:rounded-3xl">
                        <div className="w-1/2 button skeleton p-5"></div>
                        <div className="w-1/4 button skeleton p-5"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductVersionCardSkeleton;
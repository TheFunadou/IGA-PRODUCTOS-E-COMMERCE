


const ProductVersionCardSkinnySkeleton = () => {


    return (
        <div className={`w-75 px-5 pt-5 pb-15`}>
            <figure className="skeleton py-30 bg-gray-500 opacity-25 ">
            </figure>
            <div className="mt-2 flex flex-col gap-2">
                <div className="skeleton py-8 bg-gray-500 opacity-25">
                </div>
                <div className="skeleton h-1/5 py-4 bg-gray-500 opacity-25">
                </div>
                <div className="skeleton py-5 w-3/5 bg-gray-500 opacity-25">

                </div>
                <div className="flex items-center gap-2">
                    <div className="skeleton w-3/5 py-5 bg-gray-500 opacity-25"></div>
                    <div className="skeleton w-1/3 py-5 bg-gray-500 opacity-25" ></div>
                </div>
            </div>
        </div>
    );
};

export default ProductVersionCardSkinnySkeleton;
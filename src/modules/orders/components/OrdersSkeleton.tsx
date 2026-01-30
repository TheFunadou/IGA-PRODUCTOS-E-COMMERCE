

const OrderSkeleton = () => {
    return (
        <div className="bg-white rounded-xl p-5">
            <div className="w-1/2 skeleton p-3 " />
            <div className="w-1/4 skeleton p-2 mt-2" />
            <div className="flex items-center justify-between gap-5 mt-2">
                <div className="flex-1 text-center ">
                    <div className="skeleton p-2 w-1/2" />
                    <div className="skeleton p-2 mt-2" />
                </div>
                <div className="flex-1 text-center ">
                    <div className="skeleton p-2 w-1/2" />
                    <div className="skeleton p-2 mt-2" />
                </div>
                <div className="flex-1 text-center ">
                    <div className="skeleton p-2 w-1/2" />
                    <div className="skeleton p-2 mt-2" />
                </div>
                <div className="flex-1 text-center ">
                    <div className="skeleton p-2 w-1/2" />
                    <div className="skeleton p-2 mt-2" />
                </div>
            </div>
        </div>
    )
};

export default OrderSkeleton;

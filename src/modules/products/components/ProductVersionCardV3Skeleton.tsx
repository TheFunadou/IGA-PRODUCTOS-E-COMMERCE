import clsx from "clsx";

interface Props {
    viewMode?: "grid" | "list";
}

const ProductVersionCardV3Skeleton = ({ viewMode = "grid" }: Props) => {
    const isList = viewMode === "list";

    return (
        <div className={clsx(
            "rounded-2xl overflow-hidden bg-base-100 shadow-md",
            isList ? "flex flex-row" : "flex flex-col"
        )}>
            {/* Imagen */}
            <div
                className={clsx(
                    "shrink-0 bg-base-300 animate-pulse",
                    isList ? "w-32 sm:w-44 aspect-square" : "w-full aspect-square"
                )}
            />

            {/* Contenido */}
            <div className="flex flex-col gap-2.5 px-3 py-3 flex-1 min-w-0">
                <div className="h-3.5 w-4/5 bg-base-300 rounded animate-pulse" />
                <div className="h-3 w-3/5 bg-base-300 rounded animate-pulse" />

                <div className="flex gap-1.5 mt-0.5">
                    <div className="h-4 w-14 rounded-full bg-base-300 animate-pulse" />
                    <div className="h-4 w-12 rounded-full bg-base-300 animate-pulse" />
                    <div className="h-4 w-16 rounded-full bg-base-300 animate-pulse" />
                </div>

                <div className="mt-auto flex flex-col gap-2.5 pt-1">
                    <div className="h-5 w-24 bg-base-300 rounded animate-pulse" />
                    <div className="flex gap-2">
                        <div className="h-9 sm:h-10 flex-1 bg-base-300 rounded-xl animate-pulse" />
                        <div className="h-9 sm:h-10 w-12 sm:w-14 bg-base-300 rounded-xl animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductVersionCardV3Skeleton;

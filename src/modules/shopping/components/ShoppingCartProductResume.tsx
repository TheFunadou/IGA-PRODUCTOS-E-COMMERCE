import ButtonQtyCounter from "./ButtonQtyCounter";
import { FaFire, FaRegTrashAlt } from "react-icons/fa";
import { formatPrice, makeSlug } from "../../products/Helpers";
import { Link } from "react-router-dom";
import type { ShoppingCartType } from "../ShoppingTypes";
import { useDebounceCallback } from "../../../global/hooks/useDebounceCallback";
import clsx from "clsx";
import { useThemeStore } from "../../../layouts/states/themeStore";
import { useEffect, useState } from "react";

type Props = {
    data: ShoppingCartType;
    onToggleCheck?: (sku: string) => void;
    onRemoveItem?: (sku: string) => void;
    onUpdateQty?: (values: { sku: string, newQuantity: number }) => void;
    lock?: boolean;
    isAuth?: boolean;
};


const ShoppingCartProductResume = ({ data, onRemoveItem, onToggleCheck, onUpdateQty, lock = false, isAuth }: Props) => {
    const { theme } = useThemeStore();
    const [subtotal, setSubtotal] = useState<number>(0);
    const [subtotalWithDisc, setSubtotalWithDisc] = useState<number>(0);
    const debouncedOnToogleCheck = onToggleCheck && useDebounceCallback(() => onToggleCheck(data.product_version.sku), isAuth ? 300 : 0);

    const handleLockPropagation = (e: React.MouseEvent, value: boolean) => {
        if (value === true) {
            e.stopPropagation();
            e.preventDefault();
        }
    };

    useEffect(() => {
        if (data.isOffer && data.product_version.unit_price_with_discount) {
            const subtotalWithDisc = parseFloat(data.product_version.unit_price_with_discount) * data.quantity;
            setSubtotalWithDisc(subtotalWithDisc);
        };
        const subtotal = parseFloat(data.product_version.unit_price) * data.quantity;
        setSubtotal(subtotal);
    }, [data]);

    return (
        <div className="w-full flex flex-col sm:flex-row py-2 gap-2 sm:gap-0">
            <div className={clsx("w-full sm:w-5/100 flex items-center justify-start sm:justify-center", lock ? "hidden" : "block")}>
                <input type="checkbox" className="checkbox checkbox-primary" checked={data.isChecked ?? false} onChange={debouncedOnToogleCheck} disabled={lock === true} />
            </div>
            <div className="w-full sm:w-95/100">
                <div className="w-full flex flex-col sm:flex-row">
                    <div className="w-full sm:w-95/100">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 px-0 sm:px-3">
                            <Link
                                to={`/tienda/${data.category.toLowerCase()}/${makeSlug(data.product_name)}/${data.product_version.sku.toLowerCase()}`}
                                className="text-lg sm:text-xl md:text-2xl font-bold hover:underline hover:text-primary break-words">
                                {data.product_name}
                            </Link>
                            {data.isOffer && (
                                <div className={clsx(
                                    "text-base sm:text-xl md:text-2xl flex gap-1 sm:gap-2 px-2 rounded-md text-white items-center w-fit",
                                    data.discount && data.discount < 50 && "bg-error",
                                    data.discount && data.discount >= 50 && data.discount < 65 && "bg-success",
                                    data.discount && data.discount >= 65 && "bg-primary"
                                )} >
                                    <FaFire className="text-sm sm:text-lg md:text-xl" />
                                    <p className="text-sm sm:text-base md:text-lg">{data.discount}%</p>
                                </div>
                            )}
                        </div>
                        <div className="breadcrumbs bg-base-200 w-fit rounded-xl px-3 sm:px-5 mt-2">
                            <ul>
                                <li className={clsx(
                                    "text-sm sm:text-base md:text-lg font-light",
                                    theme === "ligth" ? "text-black" : "text-gray-200"
                                )}><strong>{data.category}</strong></li>
                                {data.subcategories.map((breadcrumb, index) => (
                                    <li
                                        className={clsx(
                                            "text-sm sm:text-base md:text-lg font-light",
                                            theme === "ligth" ? "text-black" : "text-gray-200"
                                        )}
                                        key={index}><strong>{breadcrumb}</strong>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className={clsx("w-full sm:w-5/100 flex items-center justify-end sm:justify-center mt-2 sm:mt-0", lock ? "hidden" : "block")}>
                        <button type="button" title="Remover del carrito" className="cursor-pointer" onClick={() => onRemoveItem && onRemoveItem(data.product_version.sku)}><FaRegTrashAlt className="text-error text-xl sm:text-2xl" /></button>
                    </div>
                </div>
                <div className="w-full flex flex-col md:flex-row mt-1 md:mt-2 gap-3 md:gap-0">
                    <div className="w-full md:w-80/100 flex gap-1">
                        <figure className="w-25 h-25 sm:w-40 md:w-50  sm:h-40 md:h-50 flex-shrink-0">
                            <Link to={`/tienda/${data.category.toLowerCase()}/${makeSlug(data.product_name)}/${data.product_version.sku.toLowerCase()}`} onClick={(e) => { handleLockPropagation(e, lock) }}>
                                <img className="w-full h-full object-cover rounded-xl border border-gray-300" src={data.product_images.find(img => img.main_image === true)?.image_url} alt={data.product_name} />
                            </Link>
                        </figure>
                        <div className="w-full md:w-65/100 flex flex-col sm:flex-row px-0 md:px-5 mt-0 md:mt-2 gap-3 ">
                            <div className="w-full sm:w-1/2 text-base sm:text-lg md:text-xl flex flex-col gap-3 sm:gap-4">
                                <p className="w-fit px-2 py-1 rounded-xl bg-base-200">{data.product_version.color_line}</p>
                                <p className="flex items-center"><span className={clsx("mr-2 w-5 h-5 rounded-full", theme === "dark" && "border border-slate-500")} style={{ backgroundColor: data.product_version.color_code }}></span>{data.product_version.color_name}</p>
                                {lock === true && <p className="w-full sm:w-35 p-1 rounded-3xl text-center text-white bg-primary">x {data.quantity} pz</p>}
                                <div className={lock ? "hidden" : "block"}>
                                    <p>Cantidad</p>
                                    <ButtonQtyCounter
                                        key={1}
                                        initQty={data.quantity}
                                        limit={data.product_version.stock}
                                        sku={data.product_version.sku}
                                        onUpdateQty={onUpdateQty}
                                        isAuth
                                        disabled={lock === true}
                                        className="w-full sm:w-1/2 bg-primary flex items-center justify-center text-white p-1 rounded-lg mt-1"
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="w-full md:w-20/100 flex gap-2 mt-3 md:mt-0">
                        <div className="w-full flex gap-5 md:flex-col">
                            <div className="mb-2">
                                <p className="text-base sm:text-lg md:text-xl">Precio unitario</p>
                                {data.isOffer && data.product_version.unit_price_with_discount && (
                                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                                        <p className={clsx(
                                            "text-xl sm:text-2xl font-bold underline",
                                            data.discount && data.discount < 50 && "text-error",
                                            data.discount && data.discount >= 50 && data.discount < 65 && "text-success",
                                            data.discount && data.discount >= 65 && "text-primary"
                                        )
                                        }>${formatPrice(data.product_version.unit_price_with_discount, "es-MX")}</p>
                                        <p className="text-sm sm:text-base line-through text-gray-500">${formatPrice(data.product_version.unit_price, "es-MX")}</p>
                                    </div>
                                )}
                                {!data.isOffer && (
                                    <p className="text-xl sm:text-2xl">${formatPrice(data.product_version.unit_price, "es-MX")}</p>
                                )}
                            </div>
                            <div>
                                <p className="text-base sm:text-lg md:text-xl">Subtotal producto</p>
                                {data.isOffer && data.product_version.unit_price_with_discount && (
                                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                                        <p className={clsx(
                                            "font-bold text-xl sm:text-2xl underline",
                                            data.discount && data.discount < 50 && "text-error",
                                            data.discount && data.discount >= 50 && data.discount < 65 && "text-success",
                                            data.discount && data.discount >= 65 && "text-primary"

                                        )}>${formatPrice(subtotalWithDisc.toString(), "es-MX")}</p>
                                        <p className="font-bold text-sm sm:text-base line-through text-gray-500">${formatPrice(subtotal.toString(), "es-MX")}</p>
                                    </div>
                                )}
                                {!data.isOffer && (
                                    <p className="font-bold text-xl sm:text-2xl underline">${formatPrice(subtotal.toString(), "es-MX")}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShoppingCartProductResume;
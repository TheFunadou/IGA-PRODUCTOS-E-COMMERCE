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
        <div className="w-full flex py-2">
            <div className={clsx("w-5/100 flex items-center justify-center", lock ? "hidden" : "block")}>
                <input type="checkbox" className="checkbox checkbox-primary" checked={data.isChecked ?? false} onChange={debouncedOnToogleCheck} disabled={lock === true} />
            </div>
            <div className="w-95/100">
                <div className="w-full flex">
                    <div className="w-95/100">
                        <div className="flex items-center gap-2 px-3">
                            <Link
                                to={`/tienda/${data.category.toLowerCase()}/${makeSlug(data.product_name)}/${data.product_version.sku.toLowerCase()}`}
                                className="text-2xl font-bold hover:underline hover:text-primary">
                                {data.product_name}
                            </Link>
                            {data.isOffer && (
                                <div className={clsx(
                                    "text-2xl flex gap-2 px-2 rounded-md text-white items-center",
                                    data.discount && data.discount < 50 && "bg-error",
                                    data.discount && data.discount >= 50 && data.discount < 65 && "bg-success",
                                    data.discount && data.discount >= 65 && "bg-primary"
                                )} >
                                    <FaFire className="text-xl" />
                                    <p className="text-lg">{data.discount}%</p>
                                </div>
                            )}
                        </div>
                        <div className="breadcrumbs bg-gray-100 w-fit rounded-xl px-5">
                            <ul>
                                <li className={clsx(
                                    "text-lg font-light",
                                    theme === "ligth" ? "text-black" : "text-gray-200"
                                )}><strong>{data.category}</strong></li>
                                {data.subcategories.map((breadcrumb, index) => (
                                    <li
                                        className={clsx(
                                            "text-lg font-light",
                                            theme === "ligth" ? "text-black" : "text-gray-200"
                                        )}
                                        key={index}><strong>{breadcrumb}</strong>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className={clsx("w-5/100 flex items-center justify-center", lock ? "hidden" : "block")}>
                        <button type="button" title="Remover del carrito" className="cursor-pointer" onClick={() => onRemoveItem && onRemoveItem(data.product_version.sku)}><FaRegTrashAlt className="text-error text-2xl" /></button>
                    </div>
                </div>
                <div className="w-full flex mt-2">
                    <figure className="w-50 h-50">
                        <Link to={`/tienda/${data.category.toLowerCase()}/${makeSlug(data.product_name)}/${data.product_version.sku.toLowerCase()}`} onClick={(e) => { handleLockPropagation(e, lock) }}>
                            <img className="w-full h-full object-cover rounded-xl border border-gray-300" src={data.product_images.find(img => img.main_image === true)?.image_url} alt={data.product_name} />
                        </Link>
                    </figure>
                    <div className=" w-65/100 flex px-5 mt-2">
                        <div className="w-1/2  text-xl flex flex-col gap-4">
                            <p className="w-fit px-2 py-1 rounded-xl bg-gray-100">{data.product_version.color_line}</p>
                            <p><span className={clsx("mr-2 px-4 py-1 rounded-full", theme === "dark" && "border border-slate-500")} style={{ backgroundColor: data.product_version.color_code }}></span>{data.product_version.color_name}</p>
                            {lock === true && <p className="w-35 p-1 rounded-3xl text-center text-white bg-primary ">x {data.quantity} pz</p>}
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
                                    className="w-1/2 bg-primary flex items-center justify-center text-white p-1 rounded-lg mt-1"
                                />
                            </div>
                        </div>
                        {/* {isAuth &&
                            <div className={clsx("w-1/2  text-xl flex flex-col gap-3", lock ? "hidden" : "block")}>
                                <button className="text-left text-primary" disabled={lock === true}>
                                    {isFavorite ? (
                                        <p className="flex gap-1 items-center">
                                            Favorito
                                            <IoMdHeart className="text-2xl" />
                                        </p>
                                    ) : (
                                        <p className="flex gap-1 items-center">
                                            Agregar a favoritos
                                            <IoIosHeartEmpty className="text-2xl" />
                                        </p>
                                    )}
                                </button>
                            </div>
                        } */}
                    </div>
                    <div className=" w-20/100 flex gap-2">
                        <div>
                            <div className="mb-2">
                                <p className="text-xl">Precio unitario</p>
                                {data.isOffer && data.product_version.unit_price_with_discount && (
                                    <div className="flex gap-2">
                                        <p className={clsx(
                                            "text-2xl font-bold underline",
                                            data.discount && data.discount < 50 && "text-error",
                                            data.discount && data.discount >= 50 && data.discount < 65 && "text-success",
                                            data.discount && data.discount >= 65 && "text-primary"
                                        )
                                        }>${formatPrice(data.product_version.unit_price_with_discount, "es-MX")}</p>
                                        <p className="text-base line-through text-gray-500">${formatPrice(data.product_version.unit_price, "es-MX")}</p>
                                    </div>
                                )}
                                {!data.isOffer && (
                                    <p className="text-2xl">${formatPrice(data.product_version.unit_price, "es-MX")}</p>
                                )}
                            </div>
                            <div>
                                <p className="text-xl">Subtotal producto</p>
                                {data.isOffer && data.product_version.unit_price_with_discount && (
                                    <div className="flex gap-2">
                                        <p className={clsx(
                                            "font-bold text-2xl underline",
                                            data.discount && data.discount < 50 && "text-error",
                                            data.discount && data.discount >= 50 && data.discount < 65 && "text-success",
                                            data.discount && data.discount >= 65 && "text-primary"

                                        )}>${formatPrice(subtotalWithDisc.toString(), "es-MX")}</p>
                                        <p className="font-bold text-base line-through text-gray-500">${formatPrice(subtotal.toString(), "es-MX")}</p>
                                    </div>
                                )}
                                {!data.isOffer && (
                                    <p className="font-bold text-2xl underline">${formatPrice(subtotal.toString(), "es-MX")}</p>
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
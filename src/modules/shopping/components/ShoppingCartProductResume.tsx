import { IoIosHeartEmpty, IoMdHeart } from "react-icons/io";
import ButtonQtyCounter from "./ButtonQtyCounter";
import { FaRegTrashAlt } from "react-icons/fa";
import { formatPrice, makeSlug } from "../../products/Helpers";
import { Link } from "react-router-dom";
import type { ShoppingCartType } from "../ShoppingTypes";
import { useDebounceCallback } from "../../../global/hooks/useDebounceCallback";
import clsx from "clsx";

type Props = {
    data: ShoppingCartType;
    onToggleCheck?: (sku: string) => void;
    onRemoveItem?: (sku: string) => Promise<void>;
    onUpdateQty?: (sku: string, qty: number) => Promise<void>;
    lock?: boolean;
    isAuth?: boolean;
};


const ShoppingCartProductResume = ({ data, onRemoveItem, onToggleCheck, onUpdateQty, lock = false, isAuth }: Props) => {
    const isFavorite = false;
    const subtotalProduct: number = parseFloat(data.product_version.unit_price) * data.quantity;
    const debouncedOnToogleCheck = onToggleCheck && useDebounceCallback(() => onToggleCheck(data.product_version.sku), isAuth ? 300 : 0);

    const handleLockPropagation = (e: React.MouseEvent, value: boolean) => {
        if (value === true) {
            e.stopPropagation();
            e.preventDefault();
        }
    };

    return (
        <div className="w-full flex py-2">
            <div className={clsx("w-5/100 flex items-center justify-center", lock ? "hidden" : "block")}>
                <input type="checkbox" className="checkbox checkbox-primary" checked={data.isChecked ?? false} onChange={debouncedOnToogleCheck} disabled={lock === true} />
            </div>
            <div className="w-95/100">
                <div className="w-full flex">
                    <div className="w-95/100">
                        <Link
                            to={`/tienda/${data.category.toLowerCase()}/${makeSlug(data.product_name)}/${data.product_version.sku.toLowerCase()}`}
                            className="text-2xl font-bold hover:underline hover:text-primary">
                            {data.product_name}
                        </Link>
                        <div className="breadcrumbs">
                            <ul>
                                <li className="text-lg text-gray-500">{data.category}</li>
                                {data.product_attributes.map((breadcrumb, index) => (
                                    <li className="text-lg text-gray-500" key={index}>{breadcrumb.category_attribute.description}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className={clsx("w-5/100 flex items-center justify-center", lock ? "hidden" : "block")}>
                        <button type="button" title="Remover del carrito" className="cursor-pointer" onClick={() => onRemoveItem && onRemoveItem(data.product_version.sku)}><FaRegTrashAlt className="text-error text-2xl" /></button>
                    </div>
                </div>
                <div className="w-full flex mt-1">
                    <figure className="w-15/100">
                        <Link to={`/tienda/${data.category.toLowerCase()}/${makeSlug(data.product_name)}/${data.product_version.sku.toLowerCase()}`} onClick={(e) => { handleLockPropagation(e, lock) }}>
                            <img className="rounded-xl border border-gray-300" src={data.product_images.find(img => img.main_image === true)?.image_url} alt={data.product_name} />
                        </Link>
                    </figure>
                    <div className=" w-65/100 flex px-5">
                        <div className="w-1/2  text-xl flex flex-col gap-4">
                            <p>{data.product_version.color_line}</p>
                            <p><span className="mr-2 px-4 py-1 rounded-full" style={{ backgroundColor: data.product_version.color_code }}></span>{data.product_version.color_name}</p>
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
                        {isAuth &&
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
                        }
                    </div>
                    <div className=" w-20/100">
                        <div className="mb-2">
                            <p className="text-xl">Precio unitario</p>
                            <p className="text-2xl">${formatPrice(data.product_version.unit_price, "es-MX")}</p>
                        </div>
                        <div>
                            <p className="text-xl">Subtotal producto</p>
                            <p className="font-bold text-2xl underline">${formatPrice(subtotalProduct.toString(), "es-MX")}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShoppingCartProductResume;
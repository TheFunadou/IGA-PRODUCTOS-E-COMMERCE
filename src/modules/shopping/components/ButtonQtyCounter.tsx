import { useState, useEffect, useRef } from 'react';
import { FaPlus, FaMinus } from "react-icons/fa";
import useDebounce from '../../../global/hooks/useDebounce';
import type { ShoppingCartI } from '../ShoppingTypes';
import clsx from 'clsx';

type Props = {
    initQty: number;
    limit: number;
    className?: string;
    item: { productUUID: string; sku: string };
    onUpdateQty?: (item: ShoppingCartI) => void;
    disabled?: boolean;
    isAuth?: boolean;
};

/**
 * Componente V2 para el contador de cantidad.
 * Utiliza el límite de stock real recibido y maneja la actualización mediante setItem.
 */
const ButtonQtyCounterV2 = ({
    initQty,
    limit,
    className = '',
    item,
    isAuth,
    disabled = false,
    onUpdateQty,
}: Props) => {
    const [quantity, setQuantity] = useState(Number(initQty));
    const [inputValue, setInputValue] = useState(initQty.toString());
    const [isUpdating, setIsUpdating] = useState(false);
    const [hasError, setHasError] = useState(false);

    // Debounce para no saturar el servidor en cada click
    const debouncedQuantity = useDebounce(quantity, 500);
    const isFirstRender = useRef(true);
    const lastSentQuantity = useRef(initQty);
    const isInputChange = useRef(false);
    const isUpdatingRef = useRef(false);

    // Sincronización con cambios externos (por ejemplo, si el carrito se actualiza desde otro lugar)
    useEffect(() => {
        const numericInitQty = Number(initQty);
        if (!isUpdatingRef.current && numericInitQty !== lastSentQuantity.current) {
            setQuantity(numericInitQty);
            setInputValue(numericInitQty.toString());
            lastSentQuantity.current = numericInitQty;
        }
    }, [initQty]);

    // Ejecutar mutación cuando cambie el valor debounced
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        // Evitar llamadas innecesarias si el valor es el mismo que el último enviado
        if (debouncedQuantity === lastSentQuantity.current) return;

        const performUpdate = async () => {
            if (!onUpdateQty) return;

            try {
                setIsUpdating(true);
                setHasError(false);
                isUpdatingRef.current = true;

                // Construir el objeto ShoppingCartI para enviarlo
                // Nota: Se envía la cantidad absoluta deseada
                onUpdateQty({
                    item: {
                        productUUID: item.productUUID,
                        sku: item.sku
                    },
                    quantity: debouncedQuantity,
                    isChecked: true
                });

                lastSentQuantity.current = debouncedQuantity;
            } catch (error) {
                console.error('Error updating quantity:', error);
                setHasError(true);
                // Revertir a la última cantidad válida
                setQuantity(lastSentQuantity.current);
                setInputValue(lastSentQuantity.current.toString());
            } finally {
                setIsUpdating(false);
                // Pequeño delay para liberar el bloqueo de actualización externa
                setTimeout(() => { isUpdatingRef.current = false; }, 100);
            }
        };

        performUpdate();
    }, [debouncedQuantity, item.sku, onUpdateQty]);

    const handleIncrement = () => {
        const currentQty = Number(quantity);
        if (currentQty >= limit || isUpdating || disabled) return;
        isInputChange.current = false;
        const next = currentQty + 1;
        setQuantity(next);
        setInputValue(next.toString());
    };

    const handleDecrement = () => {
        const currentQty = Number(quantity);
        if (currentQty <= 1 || isUpdating || disabled) return;
        isInputChange.current = false;
        const next = currentQty - 1;
        setQuantity(next);
        setInputValue(next.toString());
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        isInputChange.current = true;
        const value = e.target.value;
        if (value === '' || value === '0') { setInputValue(value); return; }

        if (/^\d+$/.test(value)) {
            setInputValue(value);
            const num = parseInt(value);
            if (!isNaN(num) && num >= 1 && num <= limit) {
                setQuantity(num);
            }
        }
    };

    const handleInputBlur = () => {
        if (isUpdating) return;
        let num = parseInt(inputValue);
        if (isNaN(num) || num < 1) num = 1;
        if (num > limit) num = limit;

        if (isInputChange.current && num !== quantity) {
            setQuantity(num);
        }
        setInputValue(num.toString());
        isInputChange.current = false;
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleInputBlur();
            e.currentTarget.blur();
        }
    };

    const atMin = quantity <= 1;
    const atMax = quantity >= limit;
    const isDisabled = disabled || isUpdating;

    return (
        <div className={`inline-flex flex-col items-start gap-1 ${className}`}>
            <div className={clsx(
                "inline-flex items-center rounded-xl overflow-hidden border-2 transition-all duration-200 bg-base-100 shadow-sm",
                hasError ? "border-error" : isUpdating ? "border-primary/40" : "border-base-300 focus-within:border-primary"
            )}>

                {/* Botón − */}
                <button
                    type="button"
                    onClick={handleDecrement}
                    disabled={atMin || isDisabled}
                    aria-label="Disminuir cantidad"
                    className={clsx(
                        "w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center flex-shrink-0 transition-all border-r border-base-300 disabled:opacity-30",
                        !atMin && !isDisabled ? "hover:bg-base-200 active:scale-90 cursor-pointer" : "cursor-not-allowed"
                    )}
                >
                    <FaMinus className="text-[10px] text-base-content" />
                </button>

                {/* Input / Spinner */}
                <div className="w-12 sm:w-14 h-9 sm:h-10 flex items-center justify-center">
                    {isUpdating && isAuth ? (
                        <span className="loading loading-spinner loading-xs text-primary" />
                    ) : (
                        <input
                            type="text"
                            inputMode="numeric"
                            value={inputValue}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            onKeyDown={handleKeyDown}
                            disabled={isDisabled}
                            aria-label="Cantidad"
                            className="w-full h-full text-center text-sm sm:text-base font-black bg-transparent text-base-content focus:outline-none select-all disabled:opacity-40"
                        />
                    )}
                </div>

                {/* Botón + */}
                <button
                    type="button"
                    onClick={handleIncrement}
                    disabled={atMax || isDisabled}
                    aria-label="Aumentar cantidad"
                    className={clsx(
                        "w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center flex-shrink-0 transition-all border-l border-base-300 disabled:opacity-30",
                        !atMax && !isDisabled ? "hover:bg-base-200 active:scale-90 cursor-pointer" : "cursor-not-allowed"
                    )}
                >
                    <FaPlus className="text-[10px] text-base-content" />
                </button>
            </div>

            {/* Indicadores de Estado */}
            <div className="h-4 flex items-center px-1">
                {isUpdating && isAuth && (
                    <span className="text-[10px] text-primary font-bold animate-pulse">Actualizando...</span>
                )}
                {hasError && (
                    <span className="text-[10px] text-error font-bold">Error de conexión</span>
                )}
                {!isUpdating && !hasError && atMax && (
                    <span className="text-[10px] text-orange-500 font-bold">Límite de stock alcanzado</span>
                )}
            </div>
        </div>
    );
};

export default ButtonQtyCounterV2;

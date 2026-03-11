import { useState, useEffect, useRef } from 'react';
import { FaPlus, FaMinus } from "react-icons/fa";
import useDebounce from '../../../global/hooks/useDebounce';
import { formatAxiosError } from '../../../api/helpers';

type Props = {
  initQty: number;
  limit: number;
  className?: string;
  sku: string;
  onUpdateQty?: (values: { sku: string; newQuantity: number }) => void;
  disabled?: boolean;
  isAuth?: boolean;
};

const ButtonQtyCounter = ({
  initQty,
  limit,
  className = '',
  sku,
  isAuth,
  disabled = false,
  onUpdateQty,
}: Props) => {
  const [quantity, setQuantity] = useState(initQty);
  const [inputValue, setInputValue] = useState(initQty.toString());
  const [isUpdating, setIsUpdating] = useState(false);
  const [hasError, setHasError] = useState(false);

  const debouncedQuantity = useDebounce(quantity, 500);
  const isFirstRender = useRef(true);
  const lastSentQuantity = useRef(initQty);
  const isInputChange = useRef(false);
  const isUpdatingRef = useRef(false);

  // Sync con cambios externos
  useEffect(() => {
    if (!isUpdatingRef.current && initQty !== lastSentQuantity.current) {
      setQuantity(initQty);
      setInputValue(initQty.toString());
      lastSentQuantity.current = initQty;
    }
  }, [initQty]);

  // Llamada al callback cuando cambia el valor debounced
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (debouncedQuantity === lastSentQuantity.current) return;

    const updateQuantity = async () => {
      if (!onUpdateQty) return;
      try {
        setIsUpdating(true);
        setHasError(false);
        isUpdatingRef.current = true;
        onUpdateQty({ sku, newQuantity: debouncedQuantity });
        lastSentQuantity.current = debouncedQuantity;
      } catch (error) {
        console.error('Error updating quantity:', formatAxiosError(error));
        setHasError(true);
        setQuantity(lastSentQuantity.current);
        setInputValue(lastSentQuantity.current.toString());
      } finally {
        setIsUpdating(false);
        setTimeout(() => { isUpdatingRef.current = false; }, 100);
      }
    };

    updateQuantity();
  }, [debouncedQuantity, sku, onUpdateQty]);

  const handleIncrement = () => {
    if (quantity >= limit || isUpdating || disabled) return;
    isInputChange.current = false;
    const next = quantity + 1;
    setQuantity(next);
    setInputValue(next.toString());
  };

  const handleDecrement = () => {
    if (quantity <= 1 || isUpdating || disabled) return;
    isInputChange.current = false;
    const next = quantity - 1;
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
      if (!isNaN(num) && num >= 1 && num <= limit) setQuantity(num);
    }
  };

  const handleInputBlur = () => {
    if (isUpdating) return;
    let num = parseInt(inputValue);
    if (isNaN(num) || num < 1) num = 1;
    if (num > limit) num = limit;
    if (isInputChange.current && num !== quantity) setQuantity(num);
    setInputValue(num.toString());
    isInputChange.current = false;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { handleInputBlur(); e.currentTarget.blur(); }
  };

  const atMin = quantity <= 1;
  const atMax = quantity >= limit;
  const isDisabled = disabled || isUpdating;

  return (
    <div className={`inline-flex flex-col items-start gap-1 ${className}`}>
      <div className={`
                inline-flex items-center rounded-xl overflow-hidden
                border-2 transition-colors duration-200
                ${hasError
          ? 'border-error'
          : isUpdating
            ? 'border-primary/40'
            : 'border-base-300 focus-within:border-primary'
        }
                bg-base-100
            `}>

        {/* Botón − */}
        <button
          type="button"
          onClick={handleDecrement}
          disabled={atMin || isDisabled}
          aria-label="Disminuir cantidad"
          className={`
                        w-8 h-9 sm:w-9 sm:h-10 flex items-center justify-center flex-shrink-0
                        transition-all duration-150 select-none
                        disabled:opacity-30 disabled:cursor-not-allowed
                        ${!atMin && !isDisabled
              ? 'hover:bg-base-200 active:scale-90 cursor-pointer'
              : ''}
                        border-r border-base-300
                    `}
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
              className="
                                w-full h-full text-center text-sm sm:text-base font-semibold
                                bg-transparent text-base-content
                                focus:outline-none select-all
                                disabled:opacity-40 disabled:cursor-not-allowed
                            "
            />
          )}
        </div>

        {/* Botón + */}
        <button
          type="button"
          onClick={handleIncrement}
          disabled={atMax || isDisabled}
          aria-label="Aumentar cantidad"
          className={`
                        w-8 h-9 sm:w-9 sm:h-10 flex items-center justify-center flex-shrink-0
                        transition-all duration-150 select-none
                        disabled:opacity-30 disabled:cursor-not-allowed
                        ${!atMax && !isDisabled
              ? 'hover:bg-base-200 active:scale-90 cursor-pointer'
              : ''}
                        border-l border-base-300
                    `}
        >
          <FaPlus className="text-[10px] text-base-content" />
        </button>
      </div>

      {/* Estado inferior */}
      <div className="h-4 flex items-center">
        {isUpdating && isAuth && (
          <span className="text-[10px] text-primary animate-pulse">Actualizando...</span>
        )}
        {hasError && (
          <span className="text-[10px] text-error">Error al actualizar</span>
        )}
        {!isUpdating && !hasError && atMax && (
          <span className="text-[10px] text-warning">Máximo disponible</span>
        )}
      </div>
    </div>
  );
};

export default ButtonQtyCounter;
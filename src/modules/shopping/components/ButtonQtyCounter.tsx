import { useState, useEffect, useRef } from 'react';
import { FaPlus, FaMinus } from "react-icons/fa";
import useDebounce from '../../../global/hooks/useDebounce';
import { formatAxiosError } from '../../../api/helpers';

type Props = {
  initQty: number;
  limit: number;
  className?: string;
  sku: string;
  onUpdateQty?: (values: { sku: string, newQuantity: number }) => void;
  disabled?: boolean;
  isAuth: boolean;
};

const ButtonQtyCounter = ({
  initQty,
  limit,
  className = '',
  sku,
  isAuth,
  disabled = false,
  onUpdateQty
}: Props) => {
  const [quantity, setQuantity] = useState(initQty);
  const [inputValue, setInputValue] = useState(initQty.toString());
  const [isUpdating, setIsUpdating] = useState(false);
  // Debounce only for authenticated users
  const debouncedQuantity = useDebounce(quantity, 500);
  // Ref to avoid initial call on mount
  const isFirstRender = useRef(true);
  // Ref to track last sent value
  const lastSentQuantity = useRef(initQty);
  // Ref to detect if change comes from input or buttons
  const isInputChange = useRef(false);
  // Ref to detect if we are in the update process
  const isUpdatingRef = useRef(false);

  // Sync with initQty when it changes externally (only if not updating)
  useEffect(() => {
    // Only update if change comes from outside and we're not in update process
    if (!isUpdatingRef.current && initQty !== lastSentQuantity.current) {
      setQuantity(initQty);
      setInputValue(initQty.toString());
      lastSentQuantity.current = initQty;
    }
  }, [initQty]);

  // Call API when debouncedQuantity changes
  useEffect(() => {
    // Avoid call on first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Only call if quantity actually changed
    if (debouncedQuantity === lastSentQuantity.current) {
      return;
    }

    const updateQuantity = async () => {
      if (!onUpdateQty) return;

      try {
        setIsUpdating(true);
        isUpdatingRef.current = true; // Mark that we are updating
        onUpdateQty({ sku, newQuantity: debouncedQuantity });
        lastSentQuantity.current = debouncedQuantity;
      } catch (error) {
        console.error('Error updating quantity:', formatAxiosError(error));
        // Revert to previous quantity on error
        setQuantity(lastSentQuantity.current);
        setInputValue(lastSentQuantity.current.toString());
      } finally {
        setIsUpdating(false);
        // Wait one tick to ensure store update completes
        setTimeout(() => {
          isUpdatingRef.current = false;
        }, 100);
      }
    };

    updateQuantity();
  }, [debouncedQuantity, sku, onUpdateQty]);

  const handleIncrement = () => {
    if (quantity < limit && !isUpdating) {
      isInputChange.current = false; // Change comes from button
      const newQty = quantity + 1;
      setQuantity(newQty);
      setInputValue(newQty.toString());
    }
  };

  const handleDecrement = () => {
    if (quantity > 1 && !isUpdating) {
      isInputChange.current = false; // Change comes from button
      const newQty = quantity - 1;
      setQuantity(newQty);
      setInputValue(newQty.toString());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    isInputChange.current = true; // Mark that change comes from input
    const value = e.target.value;

    if (value === '' || value === '0') {
      setInputValue(value);
      return;
    }

    if (/^\d+$/.test(value)) {
      setInputValue(value);
      let numValue = parseInt(value);
      if (!isNaN(numValue) && numValue >= 1 && numValue <= limit) {
        setQuantity(numValue);
      }
    }
  };

  const handleInputBlur = () => {
    if (isUpdating) return;

    let numValue = parseInt(inputValue);

    if (isNaN(numValue) || numValue < 1) {
      numValue = 1;
    }

    if (numValue > limit) {
      numValue = limit;
    }

    // Only update quantity if there was a real change from input
    if (isInputChange.current && numValue !== quantity) {
      setQuantity(numValue);
    }

    setInputValue(numValue.toString());
    isInputChange.current = false; // Reset
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputBlur();
      e.currentTarget.blur();
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={handleDecrement}
        disabled={quantity <= 1 || isUpdating || disabled === true}
        className="w-8 h-8 flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-50 rounded font-semibold text-lg select-none transition-colors">
        <FaMinus className='text-xs' />
      </button>

      <div className="relative rounded-xl">
        {isUpdating && isAuth ? (
          <span className="h-8 loading loading-spinner loading-sm"></span>
        ) : (
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            disabled={isUpdating || disabled === true}
            className="w-16 h-8 text-base text-center rounded focus:outline-none font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          />
        )}
      </div>

      <button
        onClick={handleIncrement}
        disabled={quantity >= limit || isUpdating || disabled === true}
        className="w-8 h-8 flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-50 rounded font-semibold text-lg select-none transition-colors">
        <FaPlus className='text-xs' />
      </button>

      {isAuth && isUpdating && (
        <span className="ml-2 text-xs text-gray-500">Cargando...</span>
      )}
    </div>
  );
};

export default ButtonQtyCounter;
import { useEffect, useState } from "react";

export type UseDebounceQtyType = {
    debouncedValue: number,
    isLoading: boolean;
};


export default function useDebounceQuantity(value: number, delay: number = 500): UseDebounceQtyType {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [debouncedValue, setDebouncedValue] = useState<number>(value);

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => { setDebouncedValue(value); setIsLoading(false); }, delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return { debouncedValue, isLoading };
};
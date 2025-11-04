import { useEffect, useState } from "react";

type UseDebounceType = {
    debouncedValue: string;
    debouncedLoading: boolean;
}

export default function useDebounceInputString(value: string, delay: number = 500): UseDebounceType {
    const [debouncedLoading, setDebouncedLoading] = useState<boolean>(false);
    const [debouncedValue, setDebouncedValue] = useState<string>(value);

    useEffect(() => {
        if (value.length <3) {
            setDebouncedValue("");
            setDebouncedLoading(false);
            return;
        }

        setDebouncedLoading(true);
        const timer = setTimeout(() => {
            setDebouncedValue(value);
            setDebouncedLoading(false);
        }, delay);

        return () => clearTimeout(timer);
    }, [value, delay]);

    return { debouncedValue, debouncedLoading };
};
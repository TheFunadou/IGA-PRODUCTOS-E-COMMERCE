import { useRef, useCallback } from 'react';

/**
 * Hook for debouncing functions (especially useful with arrow functions).
 * Executes the function only after the user stops calling it for a specific duration.
 * * @param callback - The function to be executed with the debounce applied.
 * @param delay - Waiting time in milliseconds (defaults to 1500ms).
 * @returns Debounced function.
 * * @example
 * const handleClick = useDebounce(() => {
 * console.log('Executed after the last click!');
 * }, 1500);
 * * // In JSX:
 * <button onClick={handleClick}>Click multiple times</button>
 */
export const useDebounceCallback = <T extends (...args: any[]) => any>(
    callback: T,
    delay: number = 1500
) => {
    const timeoutRef = useRef<number | null>(null);

    const debouncedFunction = useCallback(
        (...args: Parameters<T>) => {
            // Limpia el timeout anterior si existe
            if (timeoutRef.current !== null) {
                clearTimeout(timeoutRef.current);
            }

            // Crea un nuevo timeout
            timeoutRef.current = window.setTimeout(() => {
                callback(...args);
            }, delay);
        },
        [callback, delay]
    );

    return debouncedFunction;
};
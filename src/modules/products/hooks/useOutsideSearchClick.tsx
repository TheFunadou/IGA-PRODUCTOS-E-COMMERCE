import { useEffect } from "react";

export function useOutsideSearchClick(ref: React.RefObject<HTMLElement | null>, callback: () => void) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }

    // Cambiar de 'mousedown' a 'click' permite que el onClick del botón se ejecute primero
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };

  }, [ref, callback]);
}
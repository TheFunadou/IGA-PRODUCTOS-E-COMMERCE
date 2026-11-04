import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";


function ScrollToTop() {
    const { pathname, state } = useLocation();
    const navigationType = useNavigationType();

    useEffect(() => {
        // Al volver a la tienda se deja que ShopV3 restaure la posición exacta.
        // En el resto de rutas (y al entrar al Home de forma normal) se sube al tope.
        const restoringShop =
            pathname === "/" &&
            (navigationType === "POP" ||
                Boolean((state as { restoreShopScroll?: boolean } | null)?.restoreShopScroll));

        if (restoringShop) return;

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        })
    }, [pathname, navigationType, state]);

    return null;
}

export default ScrollToTop;

/**
 * Memoria de la posición de scroll del Home/tienda para restaurarla cuando el
 * usuario regresa desde el detalle de un producto.
 *
 * Vive en memoria del módulo (no en `sessionStorage`) para no escribir en
 * almacenamiento en cada evento de scroll. La persistencia entre recargas no es
 * necesaria: el navegador ya puede restaurar el scroll nativo en ese caso.
 */

const TTL_MS = 30 * 60 * 1000; // 30 minutos
const MAX_ATTEMPTS = 90; // ~1.5s a 60fps

let snapshot: { y: number; at: number } | null = null;

/**
 * Guarda la posición actual (o la indicada) para el próximo regreso.
 * Ignora `y <= 0` para no sobrescribir con el 0 que produce el doble montaje
 * de StrictMode en desarrollo.
 */
export const rememberShopScroll = (y: number = window.scrollY) => {
    if (!Number.isFinite(y) || y <= 0) return;
    snapshot = { y, at: Date.now() };
};

/** Devuelve la posición guardada si sigue vigente; no la consume. */
export const peekShopScroll = (): number | null => {
    if (!snapshot) return null;
    if (Date.now() - snapshot.at > TTL_MS) {
        snapshot = null;
        return null;
    }
    return snapshot.y;
};

/** Descarta la posición guardada. */
export const clearShopScroll = () => {
    snapshot = null;
};

/**
 * Restaura el scroll a `target` reintentando mientras el layout termina de
 * crecer (productos, tags de la categoría, sidebar, imágenes).
 *
 * Devuelve una función para cancelar los reintentos de forma explícita (por
 * ejemplo si el usuario cambia de categoría). No se cancela desde un efecto de
 * React para sobrevivir al doble montaje de StrictMode.
 */
export function scrollToYWithRetry(target: number): () => void {
    let cancelled = false;
    let attempts = 0;

    const step = () => {
        if (cancelled) return;
        // Si se navegó a otra ruta, no se sigue moviendo el scroll ajeno.
        if (window.location.pathname !== "/") return;

        window.scrollTo({ top: target, behavior: "auto" });

        const reached = Math.abs(window.scrollY - target) <= 2;
        const tallEnough =
            document.documentElement.scrollHeight >= target + window.innerHeight * 0.5;

        attempts += 1;

        if ((reached && tallEnough) || attempts >= MAX_ATTEMPTS) return;
        requestAnimationFrame(step);
    };

    requestAnimationFrame(step);

    return () => {
        cancelled = true;
    };
}

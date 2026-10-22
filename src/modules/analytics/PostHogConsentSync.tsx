import { useEffect } from "react";
import posthog from "posthog-js";
import { useCookieStore } from "../auth/states/cookieStore";
import type { ConsentStatus } from "../auth/states/cookieStore";

/**
 * Sincroniza el consentimiento de cookies (banner CookieConsent) con PostHog.
 *
 * PostHog se inicializa con `opt_out_capturing_by_default: true`, así que no
 * captura nada hasta que aquí se llame `opt_in_capturing()`. El SDK persiste el
 * estado opt-in/opt-out en localStorage por su cuenta; este componente es la
 * fuente de verdad: lee el mismo store (iga-cookie-consent) que usa Meta Pixel
 * y aplica la decisión al montar y en cada cambio posterior.
 *
 * - accepted  → posthog.opt_in_capturing()  (envía un $pageview de cortesía)
 * - rejected  → posthog.opt_out_capturing()
 * - null      → no hace nada (el SDK ya arranca opted-out)
 *
 * Se debe montar dentro de <PostHogProvider> para garantizar que el SDK ya
 * esté inicializado.
 */
const applyConsent = (status: ConsentStatus) => {
    if (status === "accepted") {
        posthog.opt_in_capturing();
    } else if (status === "rejected") {
        posthog.opt_out_capturing();
    }
};

const PostHogConsentSync = () => {
    const consentStatus = useCookieStore((s) => s.consentStatus);

    // Al montar: aplicar la decisión persistida (o no hacer nada si es null).
    useEffect(() => {
        applyConsent(consentStatus);
        // Se suscribe al store para reaccionar cuando el usuario cambia
        // su preferencia en caliente (acepta/rechaza desde el banner).
        const unsubscribe = useCookieStore.subscribe((state, prev) => {
            if (state.consentStatus !== prev.consentStatus) {
                applyConsent(state.consentStatus);
            }
        });
        return unsubscribe;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
};

export default PostHogConsentSync;

import { useEffect, useRef } from "react";
import posthog from "posthog-js";
import { useAuthStore } from "../auth/states/authStore";
import { useCookieStore } from "../auth/states/cookieStore";

/**
 * Sincroniza la sesión de usuario (authStore) con la identidad de PostHog.
 *
 * Objetivo: poder responder "QUIÉNES agregan productos al carrito" y ver el
 * recorrido completo de una persona (comportamiento anónimo previo + posterior
 * a iniciar sesión), que PostHog unifica automáticamente al llamar `identify`.
 *
 * - Login (email o Google) → posthog.identify(uuid, { nombre, email, ... })
 *   Se usa el UUID del cliente como distinct_id: es estable y opaco.
 *   El nombre/email van como person properties para poder segmentar.
 * - Logout → posthog.reset() para que la siguiente persona no se mezcle.
 * - Sesión ya persistida al recargar → identify en el primer render.
 *
 * IMPORTANTE: solo actúa si el usuario aceptó el banner de consentimiento
 * (mismo gating que el resto de eventos de PostHog). Un usuario sin
 * consentimiento aceptado nunca es identificado.
 *
 * Se debe montar dentro de <PostHogProvider>.
 */
const PostHogIdentitySync = () => {
    const authCustomer = useAuthStore((s) => s.authCustomer);
    const consentStatus = useCookieStore((s) => s.consentStatus);
    // Evita llamadas repetidas de identify para el mismo usuario.
    const lastIdentifiedUuid = useRef<string | null>(null);

    useEffect(() => {
        // Sin consentimiento aceptado no identificamos a nadie.
        if (consentStatus !== "accepted") {
            lastIdentifiedUuid.current = null;
            return;
        }

        if (authCustomer?.uuid) {
            // Ya identificado con este UUID → no repetir.
            if (lastIdentifiedUuid.current === authCustomer.uuid) return;
            posthog.identify(authCustomer.uuid, {
                name: authCustomer.name,
                last_name: authCustomer.last_name,
                email: authCustomer.email,
            });
            lastIdentifiedUuid.current = authCustomer.uuid;
        } else {
            // Sin sesión: si antes había un identificado, resetear a anónimo.
            if (lastIdentifiedUuid.current !== null) {
                posthog.reset();
                lastIdentifiedUuid.current = null;
            }
        }
    }, [authCustomer, consentStatus]);

    return null;
};

export default PostHogIdentitySync;

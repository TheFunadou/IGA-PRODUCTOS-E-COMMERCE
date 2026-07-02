import Pixel from "./MetaPixel";
import { type MetaEvent } from "./MetaEventsTypes";
import { useCookieStore } from "../auth/states/cookieStore";

/**
 * Fires a Meta Pixel event only when the user has explicitly granted
 * advertising consent. Calling this before consent is given (or after
 * it has been rejected) is a silent no-op — no SDK call is made.
 */
export function track(event: MetaEvent, data?: object) {
    const { hasAdvertisingConsent } = useCookieStore.getState();
    if (!hasAdvertisingConsent) return;
    Pixel.track(event, data);
}
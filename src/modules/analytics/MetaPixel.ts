import ReactPixel from "react-facebook-pixel";

const pixelId = import.meta.env.VITE_META_PIXEL_ID as string;

/**
 * Initialize Meta Pixel with autoConfig disabled.
 * - autoConfig: false → SDK does not auto-collect browser data (PII protection).
 * - pageView is NOT fired automatically here; usePageTracking handles it
 *   only after the user has granted advertising consent.
 */
ReactPixel.init(pixelId, undefined, {
    autoConfig: false,
    debug: import.meta.env.DEV,
});

export default ReactPixel;

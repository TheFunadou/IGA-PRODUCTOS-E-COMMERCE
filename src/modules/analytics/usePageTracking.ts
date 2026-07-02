import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from './MetaEvents';
import { useCookieStore } from '../auth/states/cookieStore';

/**
 * Tracks PageView events on route changes.
 * Events are only fired when the user has explicitly accepted advertising cookies.
 * When the user grants consent mid-session, the current page fires a PageView
 * immediately so the first accepted session is not lost.
 */
export const usePageTracking = () => {
    const location = useLocation();
    const hasAdvertisingConsent = useCookieStore((s) => s.hasAdvertisingConsent);

    // Re-fires when the route changes (only runs if consent is already granted)
    useEffect(() => {
        if (!hasAdvertisingConsent) return;
        trackPageView();
    }, [location.pathname, hasAdvertisingConsent]);
};

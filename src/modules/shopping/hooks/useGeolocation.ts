import { useState, useEffect, useCallback } from "react";

interface GeolocationState {
    postalCode: string | null;
    loading: boolean;
    error: string | null;
}

export const useGeolocation = () => {
    const [state, setState] = useState<GeolocationState>({
        postalCode: null,
        loading: false,
        error: null,
    });

    const fetchPostalCode = useCallback(async (lat: number, lng: number) => {
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
                {
                    headers: {
                        "User-Agent": "IGAProductosECommerce/1.0",
                    },
                }
            );
            const data = await res.json();
            const postcode = data?.address?.postcode ?? null;
            setState({ postalCode: postcode, loading: false, error: null });
        } catch {
            setState({ postalCode: null, loading: false, error: "No se pudo obtener el código postal" });
        }
    }, []);

    const requestLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setState({ postalCode: null, loading: false, error: "Geolocalización no soportada" });
            return;
        }

        setState((prev) => ({ ...prev, loading: true, error: null }));

        navigator.geolocation.getCurrentPosition(
            (position) => {
                fetchPostalCode(position.coords.latitude, position.coords.longitude);
            },
            () => {
                setState({ postalCode: null, loading: false, error: "Permiso de geolocalización denegado" });
            },
            { timeout: 10000, enableHighAccuracy: false }
        );
    }, [fetchPostalCode]);

    useEffect(() => {
        requestLocation();
    }, [requestLocation]);

    return { ...state, refetch: requestLocation };
};

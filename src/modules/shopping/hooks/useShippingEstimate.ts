import { useMemo } from "react";

const COLOMBIA_REFCODE = 96496;

function parsePc(value: unknown): number | null {
    if (typeof value === "string") {
        const n = parseInt(value.replace(/\D/g, ""), 10);
        return isNaN(n) ? null : n;
    }
    if (typeof value === "number" && !isNaN(value)) return value;
    return null;
}

export interface ShippingEstimate {
    hasOrigin: boolean;
    hasDestination: boolean;
    distanceKm: number | null;
    estimatedDays: number | null;
    estimateLabel: string;
}

function calcDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const PC_COORDS: Record<number, [number, number]> = {
    96496: [6.2442, -75.5812],
    110311: [6.8019, -75.5208],
    50021: [6.2220, -75.5710],
};

function getCoordsForPc(pc: number): [number, number] | null {
    if (PC_COORDS[pc]) return PC_COORDS[pc];
    if (pc >= 110000 && pc <= 119999) return [6.80, -75.52];
    if (pc >= 960000 && pc <= 969999) return [6.24, -75.58];
    if (pc >= 50000 && pc <= 59999) return [6.22, -75.57];
    return null;
}

function estimateDays(distanceKm: number): number {
    if (distanceKm <= 300) return 2;
    if (distanceKm <= 800) return 3;
    if (distanceKm <= 1200) return 4;
    if (distanceKm <= 1600) return 5;
    if (distanceKm <= 2500) return 7;
    return 10;
}

export const useShippingEstimate = (destinationPc: string | null | undefined): ShippingEstimate => {
    return useMemo(() => {
        const originPc = parsePc(COLOMBIA_REFCODE);
        const destPc = parsePc(destinationPc);

        if (!originPc || !destPc) {
            return {
                hasOrigin: !!originPc,
                hasDestination: false,
                distanceKm: null,
                estimatedDays: null,
                estimateLabel: "",
            };
        }

        const originCoords = getCoordsForPc(originPc);
        const destCoords = getCoordsForPc(destPc);

        if (!originCoords || !destCoords) {
            return {
                hasOrigin: true,
                hasDestination: true,
                distanceKm: null,
                estimatedDays: null,
                estimateLabel: "Envío estándar",
            };
        }

        const distance = Math.round(calcDistanceKm(originCoords[0], originCoords[1], destCoords[0], destCoords[1]));
        const days = estimateDays(distance);

        return {
            hasOrigin: true,
            hasDestination: true,
            distanceKm: distance,
            estimatedDays: days,
            estimateLabel: `${days} días hábiles (${distance.toLocaleString("es-CO")} km)`,
        };
    }, [destinationPc]);
};

import { useQuery } from "@tanstack/react-query";
import useDebounce from "../hooks/useDebounce";
import { buildSepomexZipCodesUrl } from "./sepomex.config";
import type { SepomexZipCodesResponse } from "./SepomexTypes";

const QUERY_STALE_TIME = 5 * 60 * 1000;
const QUERY_GC_TIME = 10 * 60 * 1000;

export const sepomexQueryKeys = {
    zipCodes: (zipCode: string) => `sepomex:zip-codes:${zipCode}`,
};

export const useSepomexZipCodes = ({
    zipCode,
    enabled,
}: {
    zipCode: string;
    enabled: boolean;
}) => {
    const debouncedZipCode = useDebounce(zipCode, 600);

    const shouldSearch =
        enabled && /^\d{5}$/.test(debouncedZipCode);

    return useQuery<SepomexZipCodesResponse>({
        queryKey: [sepomexQueryKeys.zipCodes(debouncedZipCode)],
        queryFn: async ({ signal }) => {
            const response = await fetch(
                buildSepomexZipCodesUrl(debouncedZipCode),
                { signal }
            );
            if (!response.ok) {
                throw new Error(
                    "No se pudo consultar el código postal. Intenta nuevamente."
                );
            }
            return (await response.json()) as SepomexZipCodesResponse;
        },
        enabled: shouldSearch,
        staleTime: QUERY_STALE_TIME,
        gcTime: QUERY_GC_TIME,
        refetchOnWindowFocus: false,
    });
};
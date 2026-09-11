const nodeEnv = import.meta.env.VITE_NODE_ENV;

export const SEPOMEX_PROD_BASE_URL = "https://sepomex.igaproductos.com";
export const SEPOMEX_DEV_BASE_URL = "https://sepomex.kurenn.dev";

export const SEPOMEX_BASE_URL =
    nodeEnv === "production" || nodeEnv === "testing"
        ? SEPOMEX_PROD_BASE_URL
        : SEPOMEX_DEV_BASE_URL;

export const SEPOMEX_ZIP_CODE_ENDPOINT = "/api/v1/zip_codes";

export const buildSepomexZipCodesUrl = (zipCode: string) =>
    `${SEPOMEX_BASE_URL}${SEPOMEX_ZIP_CODE_ENDPOINT}?zip_code=${encodeURIComponent(
        zipCode
    )}`;
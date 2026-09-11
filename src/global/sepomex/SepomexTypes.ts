export type SepomexZipCodeEntry = {
    id: number;
    d_codigo: string;
    d_asenta: string;
    d_tipo_asenta: string;
    d_mnpio: string;
    d_estado: string;
    d_ciudad: string | null;
    d_cp: string;
    c_estado: string;
    c_oficina: string;
    c_cp: string | null;
    c_tipo_asenta: string;
    c_mnpio: string;
    id_asenta_cpcons: string;
    d_zona: string;
    c_cve_ciudad: string | null;
};

export type SepomexZipCodesResponse = {
    zip_codes: SepomexZipCodeEntry[];
    meta: {
        pagination: {
            per_page: number;
            total_pages: number;
            total_objects: number;
            links: {
                first: string;
                last: string;
            };
        };
    };
};
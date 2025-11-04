export const BASE_URL:string = import.meta.env.VITE_BACKEND_URL;



export type CountriesPhoneCodeType = {
    nameES: string;
    nameEN:string;
    iso2:string;
    iso3: string;
    phoneCode: string;
};
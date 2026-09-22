import type { AuthCustomerCredentialsType, AuthenticatedCustomerType, NewCustomerWithToken, RestorePasswordPublicDTO } from "../AuthTypes";
import api from "../../../api/api.config";


export const login = async (credentials: AuthCustomerCredentialsType): Promise<AuthenticatedCustomerType> => {
    const { data } = await api.post<AuthenticatedCustomerType>("/customer-auth/login", credentials);
    return data;
};


export const loginWithGoogle = async ({ id_token }: { id_token: string }): Promise<AuthenticatedCustomerType> => {
    const { data } = await api.post<AuthenticatedCustomerType>("/customer-auth/login/google", { id_token });
    return data;
};


export const logout = async () => {
    const { data } = await api.post<string>("/customer-auth/logout", {});
    return data;
};


export const registerCustomer = async (dto: NewCustomerWithToken): Promise<string> => {
    const { data } = await api.post<string>("/customer", dto);
    return data;
};

export const verifyEmail = async ({ verificationToken }: { verificationToken: string }): Promise<string> => {
    const { data } = await api.post<string>("/customer/verify-email", { verificationToken });
    return data;
};

export const getCustomerProfile = async (): Promise<AuthenticatedCustomerType> => {
    const { data } = await api.get<AuthenticatedCustomerType>("/customer-auth/profile");
    return data;
};

export const sendVerificationToken = async ({ email, recaptchaToken }: { email: string, recaptchaToken: string }): Promise<string> => {
    const { data } = await api.post<string>("/customer-auth/verification/token/send", { email, recaptchaToken });
    return data;
};

export const resendVerificationToken = async ({ email, recaptchaToken }: { email: string, recaptchaToken: string }): Promise<string> => {
    const { data } = await api.post<string>("/customer-auth/verification/token/resend", { email, recaptchaToken });
    return data;
};

export const sendRestorePasswordToken = async ({ email, recaptchaToken }: { email: string, recaptchaToken: string }): Promise<string> => {
    const { data } = await api.post<string>("/customer-auth/password/restore/token/send", { email, recaptchaToken });
    return data;
};

export const validateRestorePasswordToken = async ({ restorePasswordToken, email }: { restorePasswordToken: string, email: string }): Promise<boolean> => {
    const { data } = await api.post<boolean>("/customer-auth/password/restore/token/validate", { restorePasswordToken, email });
    return data;
};

export const resendRestorePasswordToken = async ({ email, recaptchaToken }: { email: string, recaptchaToken: string }): Promise<string> => {
    const { data } = await api.post<string>("/customer-auth/password/restore/token/resend", { email, recaptchaToken });
    return data;
};

export const restorePasswordPublic = async (dto: RestorePasswordPublicDTO): Promise<string> => {
    const { data } = await api.post<string>("/customer-auth/password/restore", dto);
    return data;
};


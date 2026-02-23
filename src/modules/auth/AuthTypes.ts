export type CustomerType = {
  uuid: string;
  name: string;
  last_name: string;
  email: string;
  created_at: string;
  updated_at: Date;
  password: string | null;
  is_guest: boolean;
  last_session: Date | null;
};

export type NewCustomerType = Omit<CustomerType, "uuid" | "created_at" | "updated_at" | "last_session"> & {
  password: string;
  confirm_password: string;
};

export type NewCustomerWithToken = NewCustomerType & {
  token: string;
  session_id: string;
};

export type CustomerPayloadType = {
  uuid: string;
  name: string;
  last_name: string;
  email: string;
  verified: boolean;
};

export type AuthCustomerCredentialsType = {
  email: string;
  password: string;
  recaptchaToken: string;
};

export type UpdatePersonalInfoType = Pick<CustomerPayloadType, "name" | "last_name">;
export type UpdateEmailType = Pick<CustomerPayloadType, "email">;

export type AuthenticatedCustomerType = {
  payload: CustomerPayloadType;
  csrfToken: string;
};


export type RestorePasswordPublicDTO = {
  email: string;
  confirmNewPassword: string;
  newPassword: string;
  restorePasswordToken: string;
  sessionId: string;
};



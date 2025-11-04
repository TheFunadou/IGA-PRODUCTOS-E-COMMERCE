export type CustomerType = {
  uuid:string;
  name:string;
  last_name:string;
  email:string;
  contact_number:string;
  created_at:string;
  updated_at:Date;
  password:string | null;
  is_guest:boolean;
  last_session:Date | null;
};

export type NewCustomerType = Omit<CustomerType,"uuid" | "created_at" | "updated_at" | "last_session"> &{
  password:string;
}

export type AuthCustomerType = {
  uuid: string;
  name: string;
  last_name: string;
  email: string;
  is_guest: boolean;
};

export type AuthCustomerCredentialsType = {
  email: string;
  password: string;
}

export type UpdatePersonalInfoType = Pick<AuthCustomerType, "name"|"last_name">;
export type UpdateEmailType = Pick<AuthCustomerType,"email">;
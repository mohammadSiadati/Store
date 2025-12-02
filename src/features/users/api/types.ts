export type ApiUserName = {
  firstname: string;
  lastname: string;
};

export type ApiUserAddress = {
  city: string;
  street: string;
  number: number;
  zipcode: string;
};

export type ApiUser = {
  id: number;
  email: string;
  username: string;
  name: ApiUserName;
  address: ApiUserAddress;
  phone: string;
};

export type User = {
  id: number;
  fullName: string;
  email: string;
  username: string;
  city: string;
  phone: string;
};

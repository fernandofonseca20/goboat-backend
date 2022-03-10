// import { IBoatCategorie } from './index';

export interface IUser {
  id?: number;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  profileImage?: string;
  bornDate?: Date;
  documentNumber?: string;
  phone?: string;
  acceptedTermsOfUse?: boolean;
  acceptedPrivacyPolicy?: boolean;
  boatCategories?: number[],
  addressCep?: string;
  addressStreet?: string;
  addressNumber?: string;
  addressComplement?: string;
  addressDistrict?: string;
  addressCity?: string;
  addressState?: string;
}
export interface IUserUpdate {
  id?: number;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  profileImage?: string;
  bornDate?: Date;
  documentNumber?: string;
  phone?: string;
  acceptedTermsOfUse?: boolean;
  acceptedPrivacyPolicy?: boolean;
  boatCategories?: number[],
  addressCep?: string;
  addressStreet?: string;
  addressNumber?: string;
  addressComplement?: string;
  addressDistrict?: string;
  addressCity?: string;
  addressState?: string;
}
export interface ILessee {
  id?: number;
  user: number;
}
export interface ILesseeUser {
  id?: number;
  user: IUser;
}
export interface ILesseeReceivingData {
  type: string | 'pix' | 'bankAccount';
  status: boolean;
  pixType?: string | 'cpf' | 'phone' | 'email' | 'random';
  pixKey?: string;
  bankHolderName?: string;
  bankAgency?: string;
  bank?: string;
  bankHolderDocument?: string;
  bankAccount?: string;
}

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
}

// import { IBoatCategorie } from './index';

export interface IPaymentMethod {
  number: string;
  cvv: string;
  expiryDate: string;
  holderDocument: string;
  holderName: string;
  credit: boolean;
}

export interface IPaymentMethodList {
  id: number,
	credit: boolean,
	lastNumber: string
}
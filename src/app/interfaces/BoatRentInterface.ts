export interface IBoatRentStore   {
  checkin: Date,
  checkout: Date,
  peoples: number,
  coupon: string,
  typePayment: string | 'creditCard' | 'debitCard' | 'pix',
  paymentMethod: number
}
export interface IBoatRentupdatePayment   {
  stripePaymentIntent?: string,
  status?: string,
  paymentStatus: string,
}
export interface IBoatRent   {
  checkin: Date,
  checkout: Date,
  peoples: number,
  coupon?: number,
  typePayment: string | 'creditCard' | 'debitCard' | 'pix',
  paymentMethod?: number,
  paymentStatus: string,
  code: string,
  amount: number,
  amountLesse: number,
  amountRetention: number,
  user: number,
  boat: number,
  stripePaymentIntent?: string,
  status: 'waitingApproval' | 'waintingPayment' | 'confirmed' | 'concluded'
}

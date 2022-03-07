export interface IBoatRentStore   {
  checkin: Date,
  checkout: Date,
  peoples: number,
  coupon: string,
  typePayment: string | 'cardCredit' | 'cardDebit' | 'pix',
  card: number
}
export interface IBoatRent   {
  checkin: Date,
  checkout: Date,
  peoples: number,
  coupon?: number,
  typePayment: string | 'cardCredit' | 'cardDebit' | 'pix',
  card?: number,
  paymentStatus: string,
  code: string,
  amount: number,
  amountLesse: number,
  amountRetention: number,
  user: number,
  boat: number,
  status: 'waitingApproval' | 'waintingPayment' | 'confirmed' | 'concluded'
}

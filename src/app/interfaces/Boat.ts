import { Time } from "aws-sdk/clients/backupgateway";

export interface IBoat {
  id: number,
  name: string,
  description: string,
  maximumCapacity: number;
  pricePerDay: number,
  promotion: boolean,
  priceOff: number,
  percentageOff: number,
  city: string,
  state: string,
  beach: string,
  image: string,
  images: [{
    id: number,
    imageUrl: number
  }],
  typeLicense: {
    id: number,
    title: string,
    description: string
  },
  localization: object,
  boatAttributes: string[],
  boatPackage: number[],
  chekinHour: Time,
  checkoutHour: Time,
}
export interface IBoatStore {
  name: string,
  description: string,
  maximumCapacity: number;
  pricePerDay: number,
  promotion?: boolean,
  priceOff?: number,
  percentageOff?: number,
  city: string,
  state: string,
  beach?: string,
  image?: string,
  images?: string[],
  license: number,
  localization?: object,
  boatCategory: number,
  boatAttributes: string[],
  boatPackage: string[],
  chekinHour: string,
  checkoutHour: string,
}
export interface IBoatLicense {
  id: string,
  title: string,
}

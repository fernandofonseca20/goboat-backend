
import {User, Lessee, ChatMessage, BoatRents} from '@models';

export interface IChat {
  open?: boolean;
  status: string | 'goBoat' | 'lessee';
  boatRent: number;
  user: number;
  lessee: number;
}
export interface IChatMessage {
  typeMessage: string | 'text' | 'image';
  message: string;
  fromUser: number;
  createdAt?: Date;
}
export interface IListItemChat {
  open?: boolean;
  status: string | 'goBoat' | 'lessee';
  boatRent?: number | BoatRents;
  user: number | User;
  lessee: number | Lessee;
  lastMessage: ChatMessage
}

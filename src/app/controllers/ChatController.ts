import { Request, Response } from 'express';
import { EntityNotFoundError } from 'typeorm';
import path from 'path';
import * as Yup from 'yup';
import { User } from '@models';
import { Mailer, Sms, Storage, Token } from '@utils';
import { UserValidator } from '@validators';
import { Socket } from 'socket.io';

import {
  ChatRepository
} from '@repositories';

class BoatCategoryController {

  async listChats(req: Request, res: Response) {
    try {

      const data = await ChatRepository.listChatsOpen();

      return res.status(200).json(data);
    } catch (error) {
      console.log('UserController listJoinTypes error', error);
      return res.status(500).json({ message: error.message, error });
    }
  }
  
  async listMessages(socket: Socket, data, next) {
    try {  
      const { chatId } = data;

      const messages = await ChatRepository.listMessageByChatId(chatId);

      socket.join(`chat:${chatId}`);

      socket.emit('messages', messages);

      
     } catch (error) {
      console.log('VillageController list Message error', error);

      return next(new Error(error.message));
    }
  }
  
  async sendMessage(socket: Socket, data, next) {
    try {

      const { user, chatId, text } = data;
      let { image } = data;

      let type = 'text';

      if (image) {
        image = await Storage.uploadImg(image, 'village');
        type = 'image';
      }

      // const village = await ChatRepository.getById(+chatId);

      // const messageCreated = await VillageMessageRepository.store(user, { villageId, text, image, type })

      // socket.emit('message', messageCreated);
      // socket.to(`village:${villageId}`).emit('message', messageCreated);


      // await NotificationRepository.store(user.id, {
      //   type: 'request-village',
      //   message: `Foram enviadas novas mensagens na vila ${village.name}`,
      //   village: villageId,
      // });


      // return next();

    } catch (error) {
      console.log('VillageController list Message error', error);

      return next(new Error(error.message));
    }
  }
 

}

export default new BoatCategoryController();

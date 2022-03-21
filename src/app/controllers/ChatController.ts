import { Request, Response } from 'express';
import { EntityNotFoundError } from 'typeorm';
import path from 'path';
import * as Yup from 'yup';
import { User } from '@models';
import { Mailer, Sms, Storage, Token } from '@utils';
import { ChatValidator } from '@validators';
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

  // async sendMessage(socket: Socket, data, next) {
  async sendMessage(req: Request, res: Response) {
    try {

      const { user, chatId, text } = req.body;
      let { image } = req.body;

      let type = 'text';

      if (image) {
        image = await Storage.uploadImg(image, 'village');
        type = 'image';
      }

      let newArr = text.trim().split(" ");
      // return newArr;

      let message = '';

     await Promise.all(await newArr.map(async word => {
        let text = word.replace(/([0-9]{2})/, '*');
        text = text.replace(/([0-9]{3})/, '*');
        text = text.replace(/([0-9]{3})/, '*');
        text = text.replace(/([0-9]{3})/, '*');
        text = text.replace(/([0-9]{3})/, '*');
        const isEmail = await ChatValidator.isEmail({ email: word });
        if (isEmail) {
          text = '*****@****';
        }
        message += `${text} `;
      }));


      const chat = await ChatRepository.getChatById(+chatId);

      if(!chat) {
        return res.status(404).json({message: 'Chat not fount'})
      }

      const chatMessage = await ChatRepository.storeMessage({
        typeMessage: 'text',
        message: message,
        fromUser: user.id
      });

      return res.status(201).json(chatMessage);

      // socket.emit('message', messageCreated);
      // socket.to(`village:${villageId}`).emit('message', messageCreated);

      // return next();

    } catch (error) {
      console.log('VillageController list Message error', error);

      // return next(new Error(error.message));
    }
  }



}

export default new BoatCategoryController();

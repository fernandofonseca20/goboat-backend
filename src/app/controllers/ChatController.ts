import { Request, Response } from 'express';
import { EntityNotFoundError } from 'typeorm';
import path from 'path';
import * as Yup from 'yup';
import { User } from '@models';
import { Mailer, Sms, Storage, Token } from '@utils';
import { UserValidator } from '@validators';

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

}

export default new BoatCategoryController();

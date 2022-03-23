import { Request, Response } from 'express';
import { EntityNotFoundError } from 'typeorm';
import path from 'path';
import * as Yup from 'yup';
import { User } from '@models';
import { Mailer, Sms, Storage, Token } from '@utils';
import { UserValidator } from '@validators';

import {
  BoatCategoryRepository
} from '@repositories';

class BoatCategoryController {

  async listActives(req: Request, res: Response) {
    try {

      const data = await BoatCategoryRepository.listActives();

      return res.status(200).json(data);
    } catch (error) {
      console.log('BoatCategoryController listActives error', error);
      return res.status(500).json({ error });
    }
  }

}

export default new BoatCategoryController();

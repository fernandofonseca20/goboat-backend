import { Request, Response } from 'express';
import { EntityNotFoundError } from 'typeorm';
import path from 'path';
import * as Yup from 'yup';
import { User, Lessee, UserSaves } from '@models';
import { Mailer, Sms, Storage, Token } from '@utils';
import { UserValidator } from '@validators';

import {
  UserRepository,
  UserExperienceRepository,
  BoatCategoryRepository,
  UserTokenRepository,
  LesseeRepository,
  UserSavesRepository,
  BoatRepository,
  BoatRentRepository,
} from '@repositories';

class LesseeController {

  async lesseeListBoatRents(req: Request, res: Response) {
    try {
      const { user: userAuth } = req.body;
      
      const boatRents = await BoatRentRepository.listByLesse(userAuth.lessee.id);

      return res.json(boatRents);

    } catch (error) {
      console.log('LesseeController checkCode error', error);

      return res.status(500).json({ message: error.message, error });
    }
  }

}

export default new LesseeController();

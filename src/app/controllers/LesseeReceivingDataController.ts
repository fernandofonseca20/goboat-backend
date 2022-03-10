import { Request, Response } from 'express';
import { EntityNotFoundError } from 'typeorm';
import path from 'path';
import * as Yup from 'yup';
import { User, Lessee, UserSaves } from '@models';
import { ILesseeReceivingData } from '@interfaces';
import { Mailer, Sms, Storage, Token } from '@utils';
import { LesseeReceivingDataValidator } from '@validators';

import {
  LesseeReceivingDataRepository

} from '@repositories';

class LesseeReceivingDataController {

  async store(req: Request, res: Response) {
    try {
      const { user: userAuth, ...reqBody } = req.body;

      let body: ILesseeReceivingData;

      if (reqBody.type === 'pix') {
        body = await LesseeReceivingDataValidator.storePix(reqBody);
      } else {
        body = await LesseeReceivingDataValidator.storeBank(reqBody);
      }

      const ReceivingData = await LesseeReceivingDataRepository.store(body, userAuth.lessee.id);

      return res.status(201).json(ReceivingData);

    } catch (error) {
      console.log('LesseeReceivingDataController  error', error);

      return res.status(500).json({ message: error.message, error });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { user: userAuth, ...reqBody } = req.body;

      const { id } = req.params;

      let body: ILesseeReceivingData;

      if (reqBody.type === 'pix') {
        body = await LesseeReceivingDataValidator.storePix(reqBody);
      } else {
        body = await LesseeReceivingDataValidator.storeBank(reqBody);
      }

      const ReceivingData = await LesseeReceivingDataRepository.update(+id, body, userAuth.lessee.id);

      return res.status(200).json(ReceivingData);

    } catch (error) {
      console.log('LesseeReceivingDataController  error', error);

      return res.status(500).json({ message: error.message, error });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const { user: userAuth } = req.body;

      const principal = await LesseeReceivingDataRepository.getPrincipal(userAuth.lessee.id);
      const ReceivingDatas = await LesseeReceivingDataRepository.list(userAuth.lessee.id);

      return res.json({principal: principal || false, rows: ReceivingDatas});

    } catch (error) {
      console.log('LesseeReceivingDataController  error', error);

      return res.status(500).json({ message: error.message, error });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { user: userAuth } = req.body;

      const { id } = req.params;

      const ReceivingDatas = await LesseeReceivingDataRepository.getById(+id, userAuth.lessee.id);

      if (!ReceivingDatas) {
        return res.status(404).json({ message: 'ReceivingDatas not found' });
      }

      return res.json(ReceivingDatas);

    } catch (error) {
      console.log('LesseeReceivingDataController  error', error);

      return res.status(500).json({ message: error.message, error });
    }
  }

  async setPrincipal(req: Request, res: Response) {
    try {
      const { user: userAuth } = req.body;

      const { id } = req.params;

      const ReceivingDatas = await LesseeReceivingDataRepository.getById(+id, userAuth.lessee.id);

      if (!ReceivingDatas) {
        return res.status(404).json({ message: 'ReceivingDatas not found' });
      }

      await LesseeReceivingDataRepository.setPrincipal(+id, userAuth.lessee.id);

      return res.json(ReceivingDatas);

    } catch (error) {
      console.log('LesseeReceivingDataController  error', error);

      return res.status(500).json({ message: error.message, error });
    }
  }

  async destroy(req: Request, res: Response) {
    try {
      const { user: userAuth } = req.body;

      const { id } = req.params;

      const ReceivingDatas = await LesseeReceivingDataRepository.getById(+id, userAuth.lessee.id);

      if (!ReceivingDatas) {
        return res.status(404).json({ message: 'ReceivingDatas not found' });
      }

      if (ReceivingDatas.principal) {
        return res.status(401).json({ message: 'Deleting this pix key is necessary that add a new one as the main key' });
      }

      const result = await LesseeReceivingDataRepository.destroy(+id, userAuth.lessee.id);

      return res.json(result);

    } catch (error) {
      console.log('LesseeReceivingDataController  error', error);

      return res.status(500).json({ message: error.message, error });
    }
  }


}

export default new LesseeReceivingDataController();

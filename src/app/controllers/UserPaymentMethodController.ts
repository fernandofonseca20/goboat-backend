import { Request, Response } from 'express';
import * as Yup from 'yup';
import { UserPaymentMethodValidator } from '@validators';

import {
  UserPaymentMethodRepository
} from '@repositories';

class UserPaymentMethodController {

  async store(req: Request, res: Response) {
    try {
      const { user, ...reqBody } = req.body;
      const paymentMethodBody = await UserPaymentMethodValidator.store(reqBody);

      const userPaymentMethod = await UserPaymentMethodRepository.store(paymentMethodBody, user.id);

      return res.status(201).json(userPaymentMethod);
    } catch (error) {
      console.log('UserPaymentMethodController store error', error);

      if (error instanceof Yup.ValidationError)
        return res.status(400).json({
          message: 'validationError',
          errors: error.errors,
        });

      return res.status(500).json({ message: error.message, error });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { user: userAuth } = req.body;
      const { cardId } = req.params;

      const boat = await UserPaymentMethodRepository.getById(+cardId, +userAuth.id);

      return res.status(200).json(boat);
    } catch (error) {
      console.log('UserPaymentMethodController getById error', error);

      return res.status(500).json({ message: error.message, error });
    }
  }
  async update(req: Request, res: Response) {
    try {

      const { cardId } = req.params;

      const body = await UserPaymentMethodValidator.store(req.body);

      const card = await UserPaymentMethodRepository.update(+cardId, body);

      return res.status(200).json(card);
    } catch (error) {
      console.log('UserPaymentMethodController getById error', error);

      return res.status(500).json({ message: error.message, error });
    }
  }
  async list(req: Request, res: Response) {
    try {
      const { user: userAuth } = req.body;

      const cards = await UserPaymentMethodRepository.list(+userAuth.id);

      return res.status(200).json(cards);
    } catch (error) {
      console.log('UserPaymentMethodController getById error', error);

      return res.status(500).json({ message: error.message, error });
    }
  }
  async destroy(req: Request, res: Response) {
    try {
      const { user: userAuth } = req.body;
      const { cardId } = req.params;

      const boat = await UserPaymentMethodRepository.getById(+cardId, +userAuth.id);
      if (!boat) {
        return res.status(401).json({ message: 'Card not found' });
      }

      if (typeof boat.user !== 'number' && !boat.user.id === userAuth.id) {
        return res.status(401).json({ message: 'Card not found' });
      }

      const result = await UserPaymentMethodRepository.destroy(+cardId);

      return res.status(200).json(result);
    } catch (error) {
      console.log('UserPaymentMethodController getById error', error);

      return res.status(500).json({ message: error.message, error });
    }
  }

}

export default new UserPaymentMethodController();

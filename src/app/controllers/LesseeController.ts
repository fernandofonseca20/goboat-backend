import { Request, Response } from 'express';
import { EntityNotFoundError } from 'typeorm';
import path from 'path';
import * as Yup from 'yup';
import { User, Lessee, UserSaves } from '@models';
import { Mailer, Sms, Storage, Token } from '@utils';
import { UserValidator } from '@validators';

import {
  UserRepository,
  LesseeRepository,
  BoatRentRepository,
} from '@repositories';

import Stripe from 'stripe';

class LesseeController {

  async updateToLessee(req: Request, res: Response): Promise<Response> {
    try {
      const authUser = req.body.user;

      const user: User = await UserRepository.getById(+authUser.id);
      const lesseExist: Lessee = await LesseeRepository.getById(+user.id);

      if (lesseExist) {
        return res.status(401).json({ message: 'lessee already exists' })
      }
      const stripe = new Stripe(process.env.STRIPE_PUBLIC_KEY, {
        apiVersion: "2020-08-27"
      });
      let lessee = await LesseeRepository.store({ user: user.id });

      if (typeof lessee === "string") {
        return res.status(400).json({ message: '' })
      }

      const account = await stripe.accounts.create({ type: 'custom' });
      lessee = await LesseeRepository.update(lessee.id, { stripeAccount: account.id })

      await stripe.accounts.update(account.id, {
        email: user.email,
        individual: {
          address: {
            city: user.addressCity,
            country: 'BR',
            line1: user.addressStreet,
            line2: user.addressNumber,
            postal_code: user.addressCep,
            state: user.addressState
          },
          first_name: user.firstName,
          last_name: user.lastName,
          email: user.email,
          phone: user.phone
        },
        business_profile: {
          product_description: 'Boat renter',
          mcc: "7512",
        },
        documents: {
          // proof_of_registration: {files}
        },
        // external_account: created on create LesseReceivingData
        default_currency: 'BRL',
        capabilities: {
					// card_payments: "active",
					// "transfers": "active"
				},
        business_type: 'individual',
      });


      return res.status(200).json({
        user: {
          typeUser: 'lessee',
          user,
          lessee
        }
      });
    } catch (error) {
      console.log('UserController getById error', error);

      if (error instanceof EntityNotFoundError)
        return res.status(404).json({ message: 'User not found', error });

      return res.status(500).json({ message: error.message, error });
    }
  }

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

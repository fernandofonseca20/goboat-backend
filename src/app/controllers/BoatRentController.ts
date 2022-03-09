import { Request, Response } from 'express';
import * as Yup from 'yup';
import { BoatRentValidator } from '@validators';

import { differenceInDays } from 'date-fns';

import {
  BoatRepository,
  BoatRentRepository,
  BoatLicenseRepository,
  UserPaymentMethodRepository,
  CouponRepository
} from '@repositories';

import { IBoatRent } from '@interfaces';
import { User } from '@models';

import { Code } from '@utils'

class BoatRentController {

  async store(req: Request, res: Response) {
    try {
      const { user, ...reqBody } = req.body;
      const { boatId } = req.params;
      const { typePayment, card, coupon, ...boatBody } = await BoatRentValidator.store(reqBody);

      const boat = await BoatRepository.getById(+boatId);
      if (!boat) {
        return res.status(404).json({ message: 'Boat not exist' });
      }

      const boatRentExist = await BoatRentRepository.existRentNoAproved(+boatId, user.id)
      if (boatRentExist) {
        return res.status(404).json({ message: 'Exist rent for boat' })
      }

      if (typePayment !== 'pix') {
        const cardExist = await UserPaymentMethodRepository.getById(card, user.id);

        if (!cardExist) {
          return res.status(401).json({ message: 'Card not exist' });
        }
      }

      if (coupon) {
        const couponExist = await CouponRepository.getUsed(coupon, user.id);

        if (typeof couponExist === 'string') {
          return res.status(404).json({ message: couponExist })
        }
      }

      const daysRent = differenceInDays(boatBody.checkout, boatBody.checkin);

      const stripeTax = boat.pricePerDay * 0.399;

      const amount = boat.pricePerDay * daysRent;
      const amountRetention = (amount * 0.1) - 0.39;
      const amountLesse = ((amount * 0.9) - stripeTax) - (amount * 0.1);

      const boatRent: IBoatRent = {
        checkin: boatBody.checkin,
        checkout: boatBody.checkout,
        peoples: boatBody.peoples,
        coupon: null,
        typePayment: typePayment,
        card: typePayment === 'pix' ? null : card,
        paymentStatus: null,
        code: Code.generate().toString(),
        amount,
        amountLesse,
        amountRetention,
        user: user.id,
        boat: +boatId,
        status: 'waitingApproval'
      }

      const boatRentCreated = await BoatRentRepository.store(boatRent);

      return res.status(201).json(boatRentCreated);

    } catch (error) {
      console.log('BoatRentController store error', error);

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
      const { boatRentId } = req.params;

      const boatRent = await BoatRentRepository.getById(+boatRentId);

      if (!boatRent) {
        return res.status(404).json({ message: 'boatRent not found' });
      }

      return res.status(200).json(boatRent);
    } catch (error) {
      console.log('BoatRentController getById error', error);

      return res.status(500).json({ message: error.message, error });
    }
  }

  async existCoupon(req: Request, res: Response) {
    try {
      const { couponCode } = req.params;
      const { user } = req.body;

      const couponUsed = await CouponRepository.getUsed(couponCode, user.id);
      if (typeof couponUsed === 'string') {
        return res.status(401).json({ message: couponUsed })
      }

      return res.json({ message: 'Coupon is Valid' })

    } catch (error) {
      console.log('BoatRentController getById error', error);

      return res.status(500).json({ message: error.message, error });
    }
  }
}

export default new BoatRentController();

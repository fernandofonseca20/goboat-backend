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

import { Code } from '@utils';

import { Stripe } from 'stripe';

class BoatRentController {

  async store(req: Request, res: Response) {
    try {
      const { user, ...reqBody } = req.body;
      const { boatId } = req.params;
      const { typePayment, paymentMethod, coupon, ...boatBody } = await BoatRentValidator.store(reqBody);

      const boat = await BoatRepository.getById(+boatId);
      if (!boat) {
        return res.status(404).json({ message: 'Boat not exist' });
      }

      const boatRentExist = await BoatRentRepository.existRentNoAproved(+boatId, user.id)
      if (boatRentExist) {
        return res.status(404).json({ message: 'Exist rent for boat' })
      }

      if (typePayment !== 'pix') {
        const paymentMethodExist = await UserPaymentMethodRepository.getById(paymentMethod, user.id);

        if (!paymentMethodExist) {
          return res.status(401).json({ message: 'paymentMethod not exist' });
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
        paymentMethod: typePayment === 'pix' ? null : paymentMethod,
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

  async lesseeAcceptRent(req: Request, res: Response) {
    try {
      const { boatRentId } = req.params;
      const { user: userAuth } = req.body;

      let { paymentMethod, ...boatRent } = await BoatRentRepository.getById(+boatRentId);

      if (!boatRent) {
        return res.status(404).json({ message: 'Boat rent nor found' })
      }

      if (typeof paymentMethod === 'number') {
        // @ts-ignore
        paymentMethod = await UserPaymentMethodRepository.getById(paymentMethod, boatRent.user.id);
      }

      boatRent = await BoatRentRepository.accept(+boatRentId);

      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2020-08-27"
      });

      const customer = await stripe.customers.create(); // This example just creates a new Customer every time

      const stripePaymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card: {
          number: process.env.NODE_ENV !== 'dev' ? paymentMethod.number : '4242424242424242',
          exp_month: process.env.NODE_ENV !== 'dev' ? +paymentMethod.expMonth : 3,
          exp_year: process.env.NODE_ENV !== 'dev' ? +paymentMethod.expYear : 2023,
          cvc: process.env.NODE_ENV !== 'dev' ? paymentMethod.cvv : '314',
        },
      });
      await stripe.paymentMethods.attach(
        stripePaymentMethod.id,
        { customer: customer.id }
      );

      const intent = await stripe.paymentIntents.create({
        payment_method: stripePaymentMethod.id,
        customer: customer.id,
        amount: 1099,
        currency: 'usd',
        confirmation_method: 'manual',
        confirm: true
      });

      await BoatRentRepository.updatePayment(+boatRentId, {
        stripePaymentIntent: intent.id,
        paymentStatus: intent.status
      });

      return res.json(intent);


    } catch (error) {
      console.log('BoatRentController getById error', error);

      return res.status(500).json({ message: error.message, error });
    }
  }

  async lesseeRejectRent(req: Request, res: Response) {
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

  async stipeWebhook(req: Request, res: Response) {
    const sig = req.headers['stripe-signature'];

    let event;
    const endpointSecret = "whsec_0867cb18c0aa9019570ac273964c46382b99a2822b9717b924481f0b10c68be0";

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2020-08-27"
    });

    try {
      // event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      // Handle the event
      const event = req.body;
      const paymentIntent = event.data.object;

      const boatRent = await BoatRentRepository.getByPaymentIntent(paymentIntent.id);

      if (!boatRent) {
        return res.status(404).json({ message: 'Boat rent not found' })
      }

      switch (req.body.type) {
        case 'payment_intent.succeeded':

          await BoatRentRepository.updatePayment(+boatRent.id, {
            paymentStatus: event.data.object.status,
            status: 'confirmed'
          });
          console.log(event);
          console.log(req.body)
          console.log(paymentIntent)
          return res.send();
          break;
        // ... handle other event types
        case 'payment_intent.payment_failed':

          await BoatRentRepository.updatePayment(+boatRent.id, {
            paymentStatus: event.data.object.status,
            status: 'canceled'
          });
          return res.send();

        case 'payment_intent.canceled':

          await BoatRentRepository.updatePayment(+boatRent.id, {
            paymentStatus: event.data.object.status,
            status: 'canceled'
          });
          console.log(event);
          console.log(req.body)
          console.log(paymentIntent)
          return res.send();
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Return a 200 response to acknowledge receipt of the event
    res.send();
  }
}

export default new BoatRentController();

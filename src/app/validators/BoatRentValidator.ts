import * as Yup from 'yup';
import { IBoatRentStore } from '@interfaces';

class BoatRentValidator {
  async store(obj: object): Promise<IBoatRentStore> {
    const schema = Yup.object().shape({
      checkin: Yup.date().required(),
      checkout: Yup.date().required(),
      peoples: Yup.number().required(),
      coupon: Yup.string().nullable(),
      typePayment: Yup.string().test('typePayment',
        'set the payment type correctly',
        function (item) {
          return ['creditCard', 'debitCard', 'pix'].includes(item);
        }),
      paymentMethod: Yup.number().nullable(),
    }
    );

    const body: IBoatRentStore = await schema.validate(obj);

    return body;
  }

  // async update(obj: object): Promise<IUser> {
  //   const schema = Yup.object().shape({
  //   });

  //   const body: IUser = await schema.validate(obj);

  //   return body;
  // }

}

export default new BoatRentValidator();

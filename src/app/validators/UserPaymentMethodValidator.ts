import * as Yup from 'yup';
import { IPaymentMethod } from '@interfaces';

import moment from 'moment';

const isSameOrBefore = (startTime, endTime) => {
  return moment(startTime, 'HH:mm').isSameOrBefore(moment(endTime, 'HH:mm'));
}
class UserPaymentMethodValidator {
  async store(obj: object): Promise<IPaymentMethod> {
    const schema = Yup.object().shape({
      number: Yup.string().min(1).required(),
      cvv: Yup.string().min(3).max(5).required()
        .matches(/^[0-9]+$/, "Must be only digits"),
      expiryDate: Yup.string().required(),
      holderDocument: Yup.string().min(11).max(20)
        .matches(/^[0-9]+$/, "Must be only digits").required(),
      holderName: Yup.string().required(),
      credit: Yup.boolean().required(),
    }
    );

    const body: IPaymentMethod = await schema.validate(obj);

    return body;
  }

  // async update(obj: object): Promise<IUser> {
  //   const schema = Yup.object().shape({
  //   });

  //   const body: IUser = await schema.validate(obj);

  //   return body;
  // }

}

export default new UserPaymentMethodValidator();

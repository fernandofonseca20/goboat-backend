import * as Yup from 'yup';
import { IBoatRentStore } from '@interfaces';

class chatValidator {
  async isEmail(obj: object): Promise<boolean> {
    try {
      const schema = Yup.object().shape({
        email: Yup.string().email().required(),
      }
      );
      await schema.validate(obj);

      return true
    } catch (err) {
      return false
    }



  }

  // async update(obj: object): Promise<IUser> {
  //   const schema = Yup.object().shape({
  //   });

  //   const body: IUser = await schema.validate(obj);

  //   return body;
  // }

}

export default new chatValidator();

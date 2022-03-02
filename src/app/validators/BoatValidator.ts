import * as Yup from 'yup';
import { IBoatStore, IBoatFilter } from '@interfaces';

import moment from 'moment';

const isSameOrBefore = (startTime, endTime) => {
  return moment(startTime, 'HH:mm').isSameOrBefore(moment(endTime, 'HH:mm'));
}
class BoatValidator {
  async store(obj: object): Promise<IBoatStore> {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      description: Yup.string(),
      maximumCapacity: Yup.number().required(),
      pricePerDay: Yup.number(),
      promotion: Yup.boolean(),
      priceOff: Yup.number(),
      percentageOff: Yup.number(),
      boatCategory: Yup.number(),
      city: Yup.string(),
      state: Yup.string(),
      beach: Yup.string(),
      image: Yup.string(),
      images: Yup.array().of(Yup.string()),
      license: Yup.number().required(),
      boatAttributes: Yup.array().of(Yup.string()),
      boatPackage: Yup.array().of(Yup.string()),
      chekinHour: Yup.string()
        .test(
          'not empty',
          'Start time cant be empty',
          function (value) {
            return !!value;
          }
        )
        .test(
          "start_time_test",
          "Start time must be before end time",
          function (value) {
            const { checkoutHour } = this.parent;
            return isSameOrBefore(value, checkoutHour);
          }
        ),
      checkoutHour: Yup.string(),
    }
    );

    const body: IBoatStore = await schema.validate(obj);

    return body;
  }

  // async update(obj: object): Promise<IUser> {
  //   const schema = Yup.object().shape({
  //   });

  //   const body: IUser = await schema.validate(obj);

  //   return body;
  // }

  async search(obj: object): Promise<IBoatFilter> {
    const schema = Yup.object().shape({
      boatName: Yup.string().required(),
      locationName: Yup.string(),
      boatCategory: Yup.number(),
      amountOfPeople: Yup.number(),
      daily: Yup.number().required(),
    });

    const body: IBoatFilter = await schema.validate(obj);

    return body;
  }

}

export default new BoatValidator();

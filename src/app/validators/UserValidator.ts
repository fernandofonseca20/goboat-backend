import * as Yup from 'yup';
import { IUser } from '@interfaces';

class UserValidator {
  async store(obj: object): Promise<IUser> {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().min(8).max(16).required(),
      firstName: Yup.string().required(),
      lastName: Yup.string().required(),
      bornDate: Yup.date().required(),
      interests: Yup.array().of(Yup.number()),
    });

    const body: IUser = await schema.validate(obj);

    body.email = body.email.toLowerCase();

    return body;
  }

  async update(obj: object): Promise<IUser> {
    const schema = Yup.object().shape({
      email: Yup.string().email(),
      password: Yup.string().min(8).max(16),
      firstName: Yup.string(),
      lastName: Yup.string(),
      bornDate: Yup.date(),
      interests: Yup.array().of(Yup.number()),
      phone: Yup.string(),
      verifyCode: Yup.number(),
      hasSons: Yup.boolean(),
      pregantType: Yup.number(),
      pregnantReason: Yup.string(),
      pregnantTime: Yup.number(),
      packs: Yup.array().of(Yup.number()),
      occupationType: Yup.number(),
      profession: Yup.string(),
      education: Yup.string(),
      country: Yup.string(),
      state: Yup.string(),
      city: Yup.string(),
      countryGeonameid: Yup.number(),
      stateGeonameid: Yup.number(),
      cityGeonameid: Yup.number(),
      biography: Yup.string(),
      joinType: Yup.number(),
      joinReason: Yup.string(),
    });

    const body: IUser = await schema.validate(obj);

    return body;
  }

  async signIn(obj: IUser): Promise<IUser> {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().min(8).max(16).required(),
    });

    return schema.validate(obj);
  }

  async setInterests(obj: object): Promise<{ interestIds: number[] }> {
    const schema = Yup.object().shape({
      interestIds: Yup.array().of(Yup.number()).required(),
    });

    return schema.validate(obj);
  }

  async setPacks(obj: object): Promise<{ packIds: number[] }> {
    const schema = Yup.object().shape({
      packIds: Yup.array().of(Yup.number()).required(),
    });

    return schema.validate(obj);
  }

  async setPregnantType(obj: object): Promise<{ pregnantTypeId: number }> {
    const schema = Yup.object().shape({
      pregnantTypeId: Yup.number().required(),
    });

    return schema.validate(obj);
  }

  async setOccupationType(obj: object): Promise<{ occupationTypeId: number }> {
    const schema = Yup.object().shape({
      occupationTypeId: Yup.number().required(),
    });

    return schema.validate(obj);
  }

  async setJoinType(obj: object): Promise<{ joinTypeId: number }> {
    const schema = Yup.object().shape({
      joinTypeId: Yup.number().required(),
    });

    return schema.validate(obj);
  }

  async genereateCode(
    obj: object
  ): Promise<{ email?: string; phone?: string }> {
    const schema = Yup.object().shape({
      email: Yup.string().email(),
      phone: Yup.string(),
    });

    const body = await schema.validate(obj);

    if (body.email) body.email = body.email.toLowerCase();

    return body;
  }

  async checkCode(
    obj: object
  ): Promise<{ email?: string; phone?: string; code: number }> {
    const schema = Yup.object().shape({
      email: Yup.string().email(),
      phone: Yup.string(),
      code: Yup.number().required(),
    });

    const body = await schema.validate(obj);

    if (body.email) body.email = body.email.toLowerCase();

    return body;
  }

  async resetPassword(obj: object): Promise<{
    email?: string;
    phone?: string;
    code: number;
    password: string;
  }> {
    const schema = Yup.object().shape({
      email: Yup.string().email(),
      phone: Yup.string(),
      code: Yup.number().required(),
      password: Yup.string().required(),
    });

    const body = await schema.validate(obj);

    if (body.email) body.email = body.email.toLowerCase();

    return body;
  }
}

export default new UserValidator();

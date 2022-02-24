import * as Yup from 'yup';
import { IUser } from '@interfaces';

class UserValidator {
  async store(obj: object): Promise<IUser> {
    const schema = Yup.object().shape({
      email: Yup.string().email(),
      password: Yup.string().min(8).max(16),
      firstName: Yup.string(),
      lastName: Yup.string(),
      documentNumber: Yup.string(),
      phone: Yup.string(),
      bornDate: Yup.date(),
      acceptedTermsOfUse: Yup.boolean(),
      acceptedPrivacyPolicy: Yup.boolean(),
      boatCategories: Yup.array().of(Yup.number()),
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
      documentNumber: Yup.string(),
      phone: Yup.string(),
      bornDate: Yup.date(),
      boatCategories: Yup.array().of(Yup.number()),
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
      code: Yup.number().required(),
    });

    const body = await schema.validate(obj);

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

import { Request, Response } from 'express';
import { EntityNotFoundError } from 'typeorm';
import path from 'path';
import * as Yup from 'yup';
import { User } from '@models';
import {  Mailer, Sms, Storage, Token } from '@utils';
import { UserValidator } from '@validators';

import {
  UserRepository,
} from '@repositories';

class UserController {
  async store(req: Request, res: Response): Promise<Response> {
    try {
      const { profileImage, ...body } = await UserValidator.store(req.body);
      const { email } = body;

      const emailAlreadyExists = await UserRepository.emailExists(
        email.toLowerCase()
      );

      if (emailAlreadyExists) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      let user: User = await UserRepository.store(body);

      if (profileImage) {
        const profileImageUrl = await Storage.uploadImg(profileImage, 'profile');
        await UserRepository.update(user.id, { profileImage: profileImageUrl });
      }

      user = await UserRepository.findOne({ where: { id: user.id } });

      const token = await Token.generateUserToken(user.id);

      return res.status(200).json({ user, token });
    } catch (error) {
      console.log('UserController store error', error);

      if (error instanceof Yup.ValidationError)
        return res.status(400).json({
          received: {
            ...error.value,
            password: error.value.password
              ? '[WARNING] ommited for security'
              : undefined,
            profileImage: error.value.profileImage
              ? 'Image received (ex: image.png)'
              : undefined,
          },
          error: error.errors,
        });

      return res.status(500).json({ message: error.message, error });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { userId } = req.params;

      const user: User = await UserRepository.getById(+userId);

      return res.status(200).json({
        user: {
          ...user,
        }
      });
    } catch (error) {
      console.log('UserController getById error', error);

      if (error instanceof EntityNotFoundError)
        return res.status(404).json({ message: 'User not found', error });

      return res.status(500).json({ error });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { userId } = req.params;
      const {
        profileImage,
        ...body
      } = await UserValidator.update(req.body);


      let user: User = await UserRepository.update(+userId, body);

      if (profileImage) {
        const profileImageUrl = await Storage.uploadImg(profileImage, 'profile');
        await UserRepository.update(user.id, { profileImage: profileImageUrl });
      }

      user = await UserRepository.findOne({ where: { id: user.id } });

      return res.status(200).json({ user });
    } catch (error) {
      console.log('UserController update error', error);

      if (error instanceof EntityNotFoundError)
        return res.status(404).json({ message: 'User not found', error });

      if (error instanceof Yup.ValidationError) {
        return res.status(400).json({
          received: {
            ...error.value,
            password: error.value.password
              ? '[WARNING] ommited for security'
              : undefined,
            profileImage: error.value.profileImage
              ? 'Image received (ex: image.png)'
              : undefined,
          },
          error: error.errors,
        });
      }

      return res.status(500).json({ message: error.message, error });
    }
  }

  async signIn(req: Request, res: Response) {
    try {
      const { email, password } = await UserValidator.signIn(req.body);

      const isValid = await UserRepository.signIn(email, password);

      if (!isValid)
        return res.status(400).json({ message: 'Invalid password' });

      const user = await UserRepository.findOneById(isValid);

      const token: string = await Token.generateUserToken(isValid);

      return res.status(200).json({ user, token });
    } catch (error) {
      console.log('UserController sign in error', error);
      if (error instanceof EntityNotFoundError)
        return res.status(404).json({ message: 'User not found', error });
      return res.status(500).json({ error });
    }
  }

  async searchByName(req: Request, res: Response) {
    try {
      const { page = 0, itemsPerPage = 20, userName } = req.query;

      const { user } = req.body;

      if (!String(userName))
        return res.status(400).json({ message: 'userName must be provided' });

      const data = await UserRepository.searchByName(
        String(userName),
        +page,
        +itemsPerPage,
        user.id
      );

      return res.status(200).json(data);
    } catch (error) {
      console.log('UserController listJoinTypes error', error);
      return res.status(500).json({ error });
    }
  }

  async generateCode(req: Request, res: Response) {
    try {
      const { email, phone } = await UserValidator.genereateCode(req.body);
      let code: number;

      if (email) {
        code = await UserRepository.generateCode(email, 'email');

        const user = await UserRepository.findOne({ where: { email } });

        if (!user) return res.status(404).json({ message: 'User not found' });

        const template = path.resolve(
          __dirname,
          '..',
          'views',
          'verify_email.html'
        );

        await Mailer.sendMail(
          template,
          {
            name: user.fullName,
            code,
          },
          // {
          //   name: user.fullName,
          //   address: email,
          // },
          email,
          'Verificação de email'
        );
      } else if (phone) {
        code = await UserRepository.generateCode(phone, 'phone');
        await Sms.sendTokenSms(phone, code);
      } else {
        return res
          .status(400)
          .json({ message: 'Email or phone must be provided' });
      }

      console.log('verify code:', code);
      return res.status(200).json({ message: 'Sent code' });
    } catch (error) {
      console.log('UserController generateCode error', error);

      if (error instanceof Yup.ValidationError) {
        return res.status(400).json({
          received: {
            ...error.value,
          },
          error: error.errors,
        });
      }

      return res.status(500).json({ error });
    }
  }

  async checkCode(req: Request, res: Response) {
    try {
      const { email, phone, code } = await UserValidator.checkCode(req.body);

      if (email) {
        await UserRepository.checkCode(email, 'email', code);
      } else if (phone) {
        await UserRepository.checkCode(phone, 'phone', code);
      } else {
        return res
          .status(400)
          .json({ message: 'Email or phone must be provided' });
      }

      return res.status(200).json({ message: 'User verified' });
    } catch (error) {
      console.log('UserController checkCode error', error);

      if (error instanceof EntityNotFoundError)
        return res.status(404).json({ message: 'User not found', error });

      if (error instanceof Yup.ValidationError) {
        return res.status(400).json({
          received: {
            ...error.value,
          },
          error: error.errors,
        });
      }

      return res.status(500).json({ error });
    }
  }

  async sendResetPassword(req: Request, res: Response) {
    try {
      const { email, phone } = await UserValidator.genereateCode(req.body);
      let code: number;

      if (email) {
        code = await UserRepository.generateCode(email, 'email');

        const user = await UserRepository.findOne({ where: { email } });

        if (!user) return res.status(404).json({ message: 'User not found' });

        const template = path.resolve(
          __dirname,
          '..',
          'views',
          'forgot_password.html'
        );

        await Mailer.sendMail(
          template,
          {
            name: user.fullName,
            code,
          },
          {
            name: user.fullName,
            address: email,
          },
          'mami - nova senha'
        );
      } else if (phone) {
        code = await UserRepository.generateCode(phone, 'phone');
        await Sms.sendTokenSms(phone, code);
      } else {
        return res
          .status(400)
          .json({ message: 'Email or phone must be provided' });
      }

      console.log('verify code:', code);
      return res.status(200).json({ message: 'Sent code' });
    } catch (error) {
      console.log('UserController generateCode error', error);

      if (error instanceof Yup.ValidationError) {
        return res.status(400).json({
          received: {
            ...error.value,
          },
          error: error.errors,
        });
      }

      return res.status(500).json({ error });
    }
  }

  async checkPasswordCode(req: Request, res: Response) {
    try {
      const { email, phone, code } = await UserValidator.checkCode(req.body);

      if (email) {
        await UserRepository.checkCode(email, 'email', code);
      } else if (phone) {
        await UserRepository.checkCode(phone, 'phone', code);
      } else {
        return res
          .status(400)
          .json({ message: 'Email or phone must be provided' });
      }

      return res.status(200).json({ message: 'Code is valid' });
    } catch (error) {
      console.log('UserController checkCode error', error);

      if (error instanceof EntityNotFoundError)
        return res.status(404).json({ message: 'User not found', error });

      if (error instanceof Yup.ValidationError) {
        return res.status(400).json({
          received: {
            ...error.value,
          },
          error: error.errors,
        });
      }

      return res.status(500).json({ error });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { email, phone, code, password } =
        await UserValidator.resetPassword(req.body);

      let message: string;

      if (email) {
        message = await UserRepository.resetPassword(
          email,
          'email',
          code,
          password
        );
      } else if (phone) {
        message = await UserRepository.resetPassword(
          phone,
          'phone',
          code,
          password
        );
      } else {
        return res
          .status(400)
          .json({ message: 'Email or phone must be provided' });
      }

      return res.status(200).json({ message });
    } catch (error) {
      console.log('UserController resetPassword error', error);

      if (error instanceof EntityNotFoundError)
        return res.status(404).json({ message: 'User not found', error });

      if (error instanceof Yup.ValidationError) {
        return res.status(400).json({
          received: {
            ...error.value,
          },
          error: error.errors,
        });
      }

      return res.status(500).json({ error });
    }
  }

}

export default new UserController();

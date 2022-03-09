import { Request, Response } from 'express';
import { EntityNotFoundError } from 'typeorm';
import path from 'path';
import * as Yup from 'yup';
import { User, Lessee, UserSaves } from '@models';
import { Mailer, Sms, Storage, Token } from '@utils';
import { UserValidator } from '@validators';

import {
  UserRepository,
  UserExperienceRepository,
  BoatCategoryRepository,
  UserTokenRepository,
  LesseeRepository,
  UserSavesRepository,
  BoatRepository,
  BoatRentRepository,
} from '@repositories';

class UserController {
  async store(req: Request, res: Response): Promise<Response> {
    try {
      const { profileImage, boatCategories, ...body } = await UserValidator.store(req.body);
      const { email, acceptedTermsOfUse, acceptedPrivacyPolicy, } = body;

      if (!acceptedPrivacyPolicy) {
        return res.status(401).json({ message: 'accepted Privacy Policy is required how true' })
      }

      if (!acceptedTermsOfUse) {
        return res.status(401).json({ message: 'accepted Terms Of Use is required how true' })
      }

      const emailAlreadyExists = await UserRepository.emailExists(
        email.toLowerCase()
      );

      if (emailAlreadyExists) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      let user: User = await UserRepository.store({ ...body });

      if (profileImage) {
        const profileImageUrl = await Storage.uploadImg(profileImage, 'profile');
        await UserRepository.update(user.id, { profileImage: profileImageUrl });
      }

      if (boatCategories) {
        const userExperienceIds = await UserExperienceRepository.getUserExperienceIds(
          user.id
        );

        const boatCategoryValidIds = await BoatCategoryRepository.validateIds(
          boatCategories
        );

        await UserExperienceRepository.setUserExperience(
          user.id,
          userExperienceIds,
          boatCategoryValidIds
        );
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

  async updateToLessee(req: Request, res: Response): Promise<Response> {
    try {
      const authUser = req.body.user;

      const user: User = await UserRepository.getById(+authUser.id);
      const lesseExist: Lessee = await LesseeRepository.getById(+user.id);

      if (lesseExist) {
        return res.status(401).json({ message: 'lessee already exists' })
      }

      const lessee = await LesseeRepository.store({ user: user.id });

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

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { user: userAuth } = req.body;

      const user: User = await UserRepository.getById(+userAuth.id);

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

      const { user: userAuth, ...reqBody } = req.body;
      const {
        profileImage,
        ...body
      } = await UserValidator.update(reqBody);

      let user: User = await UserRepository.update(+userAuth.id, body);

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

      return res.status(200).json({ userType: 'user', user, token });
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
      const { phone } = await UserValidator.genereateCode(req.body);
      let code: number;

      code = await UserTokenRepository.store();
      await Sms.sendTokenSms(phone, code);

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

  async checkCodePassword(req: Request, res: Response) {
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

      return res.status(200).json({ message: 'code validate' })

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

  async checkCode(req: Request, res: Response) {
    try {
      const { code } = await UserValidator.checkCode(req.body);


      await UserTokenRepository.getById(code);

      return res.status(200).json({ message: 'Code verified' });
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
          'Go Boat - nova senha'
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

  async listSaves(req: Request, res: Response) {
    try {
      const { user: userAuth } = req.body;

      const { categoryId } = req.query;

      const saves = await UserSavesRepository.getUserSaves(+userAuth.id, +categoryId);

      return res.status(200).json(saves);

    } catch (error) {
      console.log('UserController checkCode error', error);

      return res.status(500).json({ message: error.message, error });
    }
  }

  async storeSave(req: Request, res: Response) {
    try {
      const { user: userAuth } = req.body;

      const { boatId } = req.body;

      if (!boatId) {
        return res.status(400).json({ message: 'Send boatId' })
      }

      const boat = await BoatRepository.getById(+boatId);

      if (!boat) {
        return res.status(400).json({ message: 'Boat not exist' })
      }

      const existSave = await UserSavesRepository.existSave(+userAuth.id, +boatId);

      if (!existSave) {
        const save = await UserSavesRepository.storeSave(+userAuth.id, +boatId);
        return res.status(201).json(save);
      }
      else if (typeof existSave !== 'boolean') {
        const save = await UserSavesRepository.destroySave(existSave.id);
        return res.status(200).json(save);

      }

    } catch (error) {
      console.log('UserController checkCode error', error);

      return res.status(500).json({ message: error.message, error });
    }
  }

  async listBoatRents(req: Request, res: Response) {
    try {
      const { user: userAuth } = req.body;
      
      const boatRents = await BoatRentRepository.listByUser(userAuth.id);

      return res.json(boatRents);

    } catch (error) {
      console.log('UserController checkCode error', error);

      return res.status(500).json({ message: error.message, error });
    }
  }

  async lesseeListBoatRents(req: Request, res: Response) {
    try {
      const { user: userAuth } = req.body;
      
      const boatRents = await BoatRentRepository.listByLesse(userAuth.lessee.id);

      return res.json(boatRents);

    } catch (error) {
      console.log('UserController checkCode error', error);

      return res.status(500).json({ message: error.message, error });
    }
  }

}

export default new UserController();

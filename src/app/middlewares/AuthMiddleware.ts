import { NextFunction, Request, Response } from 'express';
import { EntityNotFoundError } from 'typeorm';
import * as Yup from 'yup';
import { Token } from '@utils';
import { UserRepository } from '@repositories';
import { User } from '@models';

import { Socket } from 'socket.io';

class AuthMiddleware {
  async user(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const userSchema = Yup.object().shape({
      authorization: Yup.string().required(),
    });

    try {
      const { authorization } = await userSchema.validate(req.headers);

      const [bearer, token] = authorization.split(' ');

      if (bearer !== 'Bearer')
        return res.status(401).json({ message: 'Token mal-formatted' });

      const user = Token.decode(token);

      if (user.class !== 'user')
        return res.status(401).json({ message: 'Invalid token' });

      req.body.user = await UserRepository.getById(user.id);

      return next();
    } catch (error) {
      console.log(error);

      if (error instanceof Yup.ValidationError) {
        return res
          .status(401)
          .json({ message: 'Authorization was not provided' });
      }

      if (error instanceof EntityNotFoundError)
        return res.status(404).json({ message: 'User not found' });

      return res.status(500).json({ error });
    }
  }

  async userSocket(
    socket: Socket, next
  ): Promise<void> {
    const userSchema = Yup.object().shape({
      authorization: Yup.string().required(),
    });

    try {

      const { authorization } = await userSchema.validate(socket.handshake.headers);

      const [bearer, token] = authorization.split(' ');

      if (bearer !== 'Bearer'){
        return next(new Error('Token invalid'));
      }

      const user = Token.decode(token);

      if (!user) {
        return next(new Error('Token invalid'));
      }

      if (user.class !== 'user')
        return next(new Error('Token invalid'));

      const userData = await UserRepository.getById(user.id);

      socket.data.user = userData

      return next();
    } catch (error) {
      console.log(error);

      if (error instanceof Yup.ValidationError) {
        next(new Error('Authorization was not provided'));
      } else if (error instanceof EntityNotFoundError) {
        next(new Error('User not found'))
      } else {
        next(new Error(error.message))

      }
    }
  }
}

export default new AuthMiddleware();

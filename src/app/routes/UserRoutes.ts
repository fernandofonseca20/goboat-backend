import { Router } from 'express';
import { UserController } from '@controllers';
import { AuthMiddleware } from '@middlewares';
import multer, { Multer } from 'multer';

class UserRoutes {
  public router: Router;

  private multer: Multer;

  constructor() {
    this.router = Router();
    this.multer = multer();
  }

  getRoutes() {
    this.router
      .route('/users')
      .post(this.multer.single('profileImage'), UserController.store);

    this.router.route('/signup/sendCode').post(UserController.generateCode);
    this.router.route('/signup/validateCode').post(UserController.checkCode);

    this.router.route('/signin').post(UserController.signIn);


    this.router
      .route('/forgot/send')
      .post(UserController.sendResetPassword);
    this.router.route('/forgot/validate').post(UserController.checkCodePassword);


    this.router
      .route('/forgot/reset')
      .post(UserController.resetPassword);


    // this.router
    //   .route('/users/reset-password/code-verify')
    //   .post(UserController.checkPasswordCode);

    // this.router
    //   .route('/users/:userId')
    //   .get(AuthMiddleware.user, UserController.getById)
    //   .put(
    //     AuthMiddleware.user,
    //     UserController.update
    //   )
    //   .delete(AuthMiddleware.user, UserController.destroy);

    return this.router;
  }
}

export default new UserRoutes();

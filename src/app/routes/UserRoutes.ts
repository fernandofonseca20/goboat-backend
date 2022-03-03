import { Router } from 'express';
import { UserController, UserPaymentMethodController } from '@controllers';
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

    this.router
      .route('/users/saves')
      .get(AuthMiddleware.user, UserController.listSaves)
      .post(AuthMiddleware.user, UserController.storeSave);


    this.router
      .route('/users/updateToLessee')
      .post(AuthMiddleware.user, UserController.updateToLessee);

    this.router
      .route('/users/cards')
      .get(AuthMiddleware.user, UserPaymentMethodController.list)
      .post(
        AuthMiddleware.user,
        UserPaymentMethodController.store
      )
    this.router
      .route('/users/cards/:cardId')
      .get(AuthMiddleware.user, UserPaymentMethodController.getById)
      .patch(
        AuthMiddleware.user,
        UserPaymentMethodController.update
      )
      .put(
        AuthMiddleware.user,
        UserPaymentMethodController.update
      )

    this.router
      .route('/users')
      .get(AuthMiddleware.user, UserController.getById)
      .put(
        AuthMiddleware.user,
        UserController.update
      )
      .patch(
        AuthMiddleware.user,
        UserController.update
      )
    //   .delete(AuthMiddleware.user, UserController.destroy);

    return this.router;
  }
}

export default new UserRoutes();

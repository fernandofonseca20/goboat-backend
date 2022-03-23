import { Router } from 'express';
import { LesseeController, LesseeReceivingDataController } from '@controllers';
import { AuthMiddleware } from '@middlewares';
import multer, { Multer } from 'multer';

class LesseeRoutes {
  public router: Router;

  private multer: Multer;

  constructor() {
    this.router = Router();
    this.multer = multer();
  }

  getRoutes() {

    this.router
      .route('/lessees/rents')
      .get(AuthMiddleware.lessee, LesseeController.lesseeListBoatRents);

    this.router
      .route('/lessees/receivingDatas/listBanks/:id')
      .get(AuthMiddleware.lessee, LesseeReceivingDataController.listExternalBankAccounts);

    this.router
      .route('/lessees/receivingDatas')
      .post(AuthMiddleware.lessee, LesseeReceivingDataController.store)
      .get(AuthMiddleware.lessee, LesseeReceivingDataController.list);

    this.router
      .route('/lessees/receivingDatas/principal/:id')
      .patch(AuthMiddleware.lessee, LesseeReceivingDataController.setPrincipal);

    this.router
      .route('/lessees/receivingDatas/:id')
      .get(AuthMiddleware.lessee, LesseeReceivingDataController.getById)
      .patch(AuthMiddleware.lessee, LesseeReceivingDataController.update)
      .delete(AuthMiddleware.lessee, LesseeReceivingDataController.destroy);
    // .delete(AuthMiddleware.user, UserController.destroy);

    return this.router;
  }
}

export default new LesseeRoutes();

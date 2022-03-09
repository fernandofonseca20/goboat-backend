import { Router } from 'express';
import { BoatRentController } from '@controllers';
import multer, { Multer } from 'multer';

import { AuthMiddleware } from '@middlewares';

class BoatRentRoutes {
  public router: Router;

  private multer: Multer;

  constructor() {
    this.router = Router();
    this.multer = multer();
  }

  getRoutes() {
    // this.router
    //   .route('/rents')
    //   .post(AuthMiddleware.lessee, BoatRentController.store);

    this.router
      .route('/rents/:boatRentId')
      .get(AuthMiddleware.user, BoatRentController.getById);

    return this.router;
  }
}

export default new BoatRentRoutes();

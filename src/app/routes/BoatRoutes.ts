import { Router } from 'express';
import { BoatController } from '@controllers';
import multer, { Multer } from 'multer';

import { AuthMiddleware } from '@middlewares';

class BoatRoutes {
  public router: Router;

  private multer: Multer;

  constructor() {
    this.router = Router();
    this.multer = multer();
  }

  getRoutes() {
    this.router
      .route('/boats')
      .post(AuthMiddleware.lessee, BoatController.store);

    this.router
      .route('/boats/licenses')
      .get(AuthMiddleware.lessee, BoatController.listLicenseActveds);
    this.router
      .route('/boats/attributes')
      .get(AuthMiddleware.lessee, BoatController.attributesDefault);

    this.router
      .route('/boats/search')
      .post(AuthMiddleware.user, BoatController.search);
      
    this.router
      .route('/boats/:boatId')
      .get(AuthMiddleware.user, BoatController.getById); 

    return this.router;
  }
}

export default new BoatRoutes();

import { Router } from 'express';
import { BoatCategoryController } from '@controllers';
import multer, { Multer } from 'multer';

class BoatCategoriesRoutes {
  public router: Router;

  private multer: Multer;

  constructor() {
    this.router = Router();
    this.multer = multer();
  }

  getRoutes() {
    this.router
      .route('/boatCategories/activeds')
      .get( BoatCategoryController.listActives);

    return this.router;
  }
}

export default new BoatCategoriesRoutes();

import { Router } from 'express';
import { HomeController } from '@controllers';
import multer, { Multer } from 'multer';

class HomeRoutes {
  public router: Router;

  private multer: Multer;

  constructor() {
    this.router = Router();
    this.multer = multer();
  }

  getRoutes() {
    this.router
      .route('/home')
      .get( HomeController.show);

    return this.router;
  }
}

export default new HomeRoutes();

import { Application } from 'express';

import UserRoutes from './UserRoutes';
import BoatCategoryRoutes from './BoatCategoryRoutes';
import HomeRoutes from './HomeRoutes';

const API = '/api';

class Routes {
  public setRoutes(app: Application): void {
    app.use(API, UserRoutes.getRoutes());
    app.use(API, HomeRoutes.getRoutes());
  }
}

export default new Routes();

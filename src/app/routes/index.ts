import { Application } from 'express';

import UserRoutes from './UserRoutes';
import BoatCategoryRoutes from './BoatCategoryRoutes';
import HomeRoutes from './HomeRoutes';
import BoatRoutes from './BoatRoutes';
import BoatRentRoutes from './BoatRentRoutes';
import LesseeRoutes from './LesseeRoutes';
import ChatRoutes from './ChatRoutes';

const API = '/api';

class Routes {
  public setRoutes(app: Application): void {
    app.use(API, UserRoutes.getRoutes());
    app.use(API, HomeRoutes.getRoutes());
    app.use(API, BoatRoutes.getRoutes());
    app.use(API, BoatCategoryRoutes.getRoutes());
    app.use(API, BoatRentRoutes.getRoutes());
    app.use(API, LesseeRoutes.getRoutes());
    app.use(API, ChatRoutes.getRoutes());
  }
}

export default new Routes();

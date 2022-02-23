import { Application } from 'express';

import UserRoutes from './UserRoutes';

const API = '/api';

class Routes {
  public setRoutes(app: Application): void {
    app.use(API, UserRoutes.getRoutes());
  }
}

export default new Routes();

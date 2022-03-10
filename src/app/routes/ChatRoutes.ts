import { Router } from 'express';
import { ChatController } from '@controllers';
import multer, { Multer } from 'multer';

class ChatRoutes {
  public router: Router;

  private multer: Multer;

  constructor() {
    this.router = Router();
    this.multer = multer();
  }

  getRoutes() {
    this.router
      .route('/chats')
      .get(ChatController.listChats);

    return this.router;
  }
}

export default new ChatRoutes();

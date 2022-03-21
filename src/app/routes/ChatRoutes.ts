import { Router } from 'express';
import { ChatController } from '@controllers';
import {AuthMiddleware} from '@middlewares'
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
    this.router
      .route('/chats/sendMessage')
      .post(AuthMiddleware.user, ChatController.sendMessage);

    return this.router;
  }
}

export default new ChatRoutes();

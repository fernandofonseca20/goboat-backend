import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';

import { VillageController } from '@controllers';

import { AuthMiddleware } from '@middlewares';

import { User } from '@models';

class SocketServer {
  private io: Server;

  // * setup socket
  public setup(server: HttpServer): void {
    this.io = new Server(server, {
      cors: {
        origin: '*',
        methods: ['POST', 'GET', 'PUT', 'DELETE'],
        allowedHeaders: ['Authorization'],
      },
    });

    this.start();
  }

  private start(): void {
    console.log('[SOCKET] Started');

    this.io.use(async (socket, next) => AuthMiddleware.userSocket(socket, next)).on('connection', (socket: any) => {

      console.log('connected');
      socket.emit('connection')
      socket.on('chat', (data, next) => { VillageController.listMessages(socket, data, next) });
      socket.on('sendMessage', (data, next) => { VillageController.sendMessage(socket, data, next) });

      socket.on('disconnect', () => console.log('disconnect'));
    });


  }
}

export default new SocketServer();

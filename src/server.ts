import express, { Application, urlencoded, json } from 'express';
import cors from 'cors';
import aws from 'aws-sdk';
import awsConfig from '@config/aws';
import { Server as HttpServer, createServer } from 'http';
import { createConnection } from 'typeorm';

import Routes from '@routes';

import Socket from './socket';

// import Swagger from './swagger';

import 'reflect-metadata';

class Server {
  public app: Application;

  public server: HttpServer;

  constructor() {
    aws.config = new aws.Config(awsConfig);
    this.app = express();
    this.server = createServer(this.app);
    this.setupServer(this.app);
  }

  private setupServer(app: Application): void {
    // * support application/json type post data
    app.use(json());
    // * support application/x-www-form-urlencoded post data
    app.use(urlencoded({ extended: false }));
    // * enable cors
    app.use(cors());
    // * setup swagger
    // Swagger.setup(app);
  }

  public async init(): Promise<void> {
    try {
      // * connect to postgres
      await createConnection();

      // * set routes
      Routes.setRoutes(this.app);

      // * setup and start socket
      Socket.setup(this.server);

      // * start server
      this.server.listen(3333, () => {
        console.log(`[SERVER] Running on port: 3333`);
      });
    } catch (error) {
      console.log(error);
    }
  }
}

export default new Server();

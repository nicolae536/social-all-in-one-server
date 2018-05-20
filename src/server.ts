import * as express from 'express';
import * as http from 'http';
import * as mongoose from 'mongoose';
import {Mongoose} from 'mongoose';
import * as WebSocket from 'ws';
import {onSocketConnection} from './utils/server-helpers';

const app = express();
//initialize a simple http server
const server = http.createServer(app);
// to force decorators evaluation on services
require('./controllers');

export class WebSocketServer extends WebSocket.Server {
  private connectionString: string;

  constructor() {
    super({server: server});
  }

  configure() {
    this.connectionString = `mongodb://127.0.0.1:27017/social-all-in-one`;
  }

  async start() {
    const mongose: Mongoose = await mongoose.connect(this.connectionString, );

    if (!mongose.connection) {
      console.error('Cannot connect to mongodb');
      return;
    }

    this.on('connection', (ws: WebSocket, request) => {
      //connectionDef is up, let's add a simple simple event
      onSocketConnection(this, ws, request);
    });

    server.listen(process.env.PORT || 8999, () => {
      console.log(`Server started on port ${server.address().port} :)`);
    });
  }
}


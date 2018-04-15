import * as express from 'express';
import * as http from 'http';
import {Container, Scope} from 'typescript-ioc';
import * as WebSocket from 'ws';
import {RootMessageProcessor} from './root-processor';

const app = express();
//initialize a simple http server
const server = http.createServer(app);
// to force decorators evaluation on services
require('./socket-controllers');

export class WebSocketServer extends WebSocket.Server {
  constructor() {
    super({server: server});
  }

  start() {
    this.on('connection', (ws: WebSocket) => {
      //connection is up, let's add a simple simple event
      ws.on('message', (message: string) => {
        try {
          // dynamic configuration for web socket so we have a provider for it on each request pointing to the current web socket
          // when creating new classes using Ioc
          Container.bind(WebSocket).to(WebSocket).provider({
            get: () => ws
          }).scope(Scope.Local);
          RootMessageProcessor.processMessage(message);
        } catch (e) {
          console.error(e.message);
        }
      });

      //send immediately a feedback to the incoming connection
      ws.send('Hi there, I am a WebSocket server');
    });

    server.listen(process.env.PORT || 8999, () => {
      console.log(`Server started on port ${server.address().port} :)`);
    });
  }
}


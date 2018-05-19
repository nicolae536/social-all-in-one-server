import {Provides, Inject, Container} from 'typescript-ioc';
import * as WebSocket from 'ws';
import {IWebMessage} from '../models';
import {WebSocketServer} from '../server';

export abstract class IWebConnection {
  abstract replay(message: IWebMessage<any>, payload?: Object): void;

  abstract broadcastReply(message: IWebMessage<any>): void;
}

@Provides(IWebConnection)
export class WebConnection implements IWebConnection {
  server: WebSocketServer = Container.get(WebSocketServer);
  @Inject
  ws: WebSocket;

  constructor() {
  }

  replay(message: IWebMessage<any>, payload: Object): void {
    if (payload) {
      message.payload = payload;
    }

    this.ws.send(message.toJson());
  }

  broadcastReply(message: IWebMessage<any>): void {
    this.server.clients.forEach(c => {
      if (c == this.ws) {
        return;
      }

      c.send(message.toBroadcastJson());
    });
  }
}
import {Provides, Inject, Container} from 'typescript-ioc';
import * as WebSocket from 'ws';
import {IWebMessage} from '../models';
import {WebSocketServer} from '../server';

export abstract class IWebConnection {
  abstract replay(message: IWebMessage<any>): void;

  abstract replayAll(message: IWebMessage<any>): void;
}

@Provides(IWebConnection)
export class WebConnection implements IWebConnection {
  server: WebSocketServer = Container.get(WebSocketServer);
  @Inject
  ws: WebSocket;

  constructor() {
  }

  replay(message: IWebMessage<any>): void {
  }

  replayAll(message: IWebMessage<any>): void {
  }

}
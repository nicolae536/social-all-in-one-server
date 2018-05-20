import {IncomingMessage} from 'http';
import * as WebSocket from 'ws';
import {IWebMessage, WebMessage} from '../models';
import {WebSocketServer} from '../server';
import {WebConnection} from '../web-connection';
import {CommunicationError, ImplementationError, ServerError} from './util';
import {WebControllerFactory} from './web-controller-factory';

export function onSocketConnection(server: WebSocketServer, ws: WebSocket, request: IncomingMessage) {

  let webConnection = new WebConnection(server, ws);

  ws.on('message', async (message: string) => {
    try {
      const webM: IWebMessage<string> = WebMessage.fromMessage(message, webConnection, request);

      const processor = WebControllerFactory.getController(webM.type);
      if (processor) {
        await processor.processCommand(webM);
      }

      CommunicationError.unsuportedMessage(webM);

    } catch (e) {
      rootErrorHandler(e, (error: string) => ws.send(error));
    }
  });

  ws.on('close', () => {
    webConnection = null;
  });
}

export function rootErrorHandler(e: ServerError | Error, reply: (s: string) => void) {
  if (e instanceof ImplementationError) {
    console.error(e.stack);
    console.error('Error message' + e.stringify());
    return;
  }

  if (e instanceof CommunicationError) {
    reply(e.stringify());
    return;
  }

  console.error(e.stack);
  reply(e.message);
}
import {IncomingMessage} from 'http';
import {Container, Scope} from 'typescript-ioc';
import * as WebSocket from 'ws';
import {RootMessageProcessor} from '../root-processor';
import {WebSocketServer} from '../server';
import {CommunicationError, ImplementationError, ServerError} from './util';

export function setupSocketListeners(server: WebSocketServer, ws: WebSocket, request: IncomingMessage) {
  ws.on('message', async (message: string) => {
    {
      try {
        // dynamic configuration for web socket so we have a provider for it on each request pointing to the current web socket
        // when creating new classes using Ioc
        Container.bind(WebSocket).to(WebSocket).provider({
          get: () => ws
        }).scope(Scope.Local);
        await RootMessageProcessor.processMessage(message, request);
      } catch (e) {
        rootErrorHandler(e, (error: string) => ws.send(error));
      }
    }
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
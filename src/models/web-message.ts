import {IncomingMessage} from 'http';
import * as querystring from 'querystring';
import * as url from 'url';
import {IWebConnection} from '../web-connection';
import {convertToString, CommunicationError} from '../utils';

interface IWebConnectionDef {
  sessionId: string;
  ip: string;
  socketId: string;
}

export interface IWebMessage<T> {
  type: string;
  payload: string | T;
  connectionDef: IWebConnectionDef;
  httpRequestMessage: IncomingMessage;
  connection: IWebConnection;

  toJson(): string;

  toBroadcastJson(): string;
}

export class WebMessage implements IWebMessage<string> {
  payload: string;
  type: string;
  connectionDef: IWebConnectionDef;
  httpRequestMessage: IncomingMessage;
  connection: IWebConnection;

  toJson(): string {
    return JSON.stringify({
      sessionId: this.connectionDef ? this.connectionDef.sessionId : '',
      type: this.type,
      payload: this.payload
    });
  }

  toBroadcastJson(): string {
    return JSON.stringify({
      type: this.type,
      payload: this.payload
    });
  }

  static fromMessage(message: string, connection: IWebConnection, request: IncomingMessage): IWebMessage<string> {
    const reply = new WebMessage();

    try {
      const params: any = querystring.parse(url.parse(request.url).query);

      const data = JSON.parse(message);
      reply.connectionDef = {
        sessionId: convertToString(params.sessionId) || convertToString(data.sessionId),
        ip: convertToString(request.connection.remoteAddress),
        socketId: convertToString(request.headers['Sec-WebSocket-Key']) || ''
      };
      reply.type = convertToString(data.type);
      reply.payload = convertToString(data.payload);

      reply.connection = connection;
      reply.httpRequestMessage = request;

      return reply;
    } catch (e) {
      CommunicationError.unsuportedMessage(e);
    }
  }
}


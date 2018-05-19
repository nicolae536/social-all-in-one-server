import {convertToString, CommunicationError} from '../utils';

export interface IWebMessage<T> {
  type: string;
  payload: string | T;
  session: string;
  ip: string;

  toJson(): string;

  toBroadcastJson(): string;
}

export class WebMessage implements IWebMessage<string> {
  payload: string;
  session: string;
  type: string;
  ip: string;

  toJson(): string {
    return JSON.stringify({
      sessionId: this.session,
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

  static fromMessage(message: string): IWebMessage<string> {
    const reply = new WebMessage();

    try {
      const data = JSON.parse(message);
      reply.session = convertToString(data.sessionId);
      reply.type = convertToString(data.type);
      reply.payload = convertToString(data.payload);

      return reply;
    } catch (e) {
      CommunicationError.unsuportedMessage(e);
    }
  }
}


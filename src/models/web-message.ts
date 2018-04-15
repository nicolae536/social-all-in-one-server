import {convertToString, WebMessageError} from '../utils';

export interface IWebMessage<T> {
  type: string;
  payload: string;
  sessionId: string | T;
  error?: WebMessageError;
}

export class WebMessage implements IWebMessage<string> {
  payload: string;
  sessionId: string;
  type: string;

  toJson(): string {
    return JSON.stringify(this);
  }

  static fromMessage(message: string): IWebMessage<string> {
    const reply = new WebMessage();

    try {
      const data = JSON.parse(message);
      reply.sessionId = convertToString(data.sessionId);
      reply.type = convertToString(data.type);
      reply.payload = convertToString(data.payload);

      return reply;
    } catch (e) {
      throw new WebMessageError('Invalid message format');
    }
  }
}


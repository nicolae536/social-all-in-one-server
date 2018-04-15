import {WebMessageError} from '../utils';

export class PublicMessage {
  fromUser: string;
  toUsers: string[];
  message: string;

  static fromMessage(payload: string): PublicMessage {
    try {
      const json = JSON.parse(payload);
      let out = new PublicMessage();
      out.message = json.message || '';
      out.fromUser = json.fromUser || '';
      out.toUsers = json.toUsers || [];

      return out;
    } catch (e) {
      throw new WebMessageError('Invalid message payload');
    }

  }
}
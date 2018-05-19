import {CommunicationError} from '../utils';

export class LoginMessage {
  userId: string; // can be emailt or anything
  userPassword: string;

  termsAgreed: boolean = false;

  static fromMessage(json: any): LoginMessage {
    let out = new LoginMessage();
    out.userId = json.userId || '';

    if (!json || json.userId === '') {
      CommunicationError.badRequest('Invalid user id', {userId: json.userId});
    }

    if (json.userPassword === '') {
      CommunicationError.badRequest('Invalid password id', {userPassword: json.userPassword});
    }

    out.userPassword = json.userPassword || '';
    return out;
  }

  static fromSignupMessage(json: any): LoginMessage {
    let out = LoginMessage.fromMessage(json);
    out.termsAgreed = json.termsAgreed || false;
    return out;
  }
}
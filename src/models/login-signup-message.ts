import {CommunicationError} from '../utils';

export class LoginSignupMessage {
  userId: string; // can be emailt or anything
  userPassword: string;

  termsAgreed?: boolean = false;

  static fromMessage(json: any): LoginSignupMessage {
    let out = new LoginSignupMessage();
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

  static fromSignupMessage(json: any): LoginSignupMessage {
    let out = LoginSignupMessage.fromMessage(json);
    out.termsAgreed = json.termsAgreed || false;
    return out;
  }
}

export class LogoutMessage {
  id: string;

  static fromMessage(message: string) {
    try {
      const msg = JSON.parse(message);
      const out = new LogoutMessage();
      out.id = msg.id;

      return out;
    } catch (e) {
      CommunicationError.unsuportedMessage(message);
    }
  }
}
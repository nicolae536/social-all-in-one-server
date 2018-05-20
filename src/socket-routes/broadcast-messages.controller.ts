import {Command, CommandController} from '../decorators';
import {PublicMessage, IWebMessage} from '../models';

@CommandController()
export class BroadcastMessagesController {
  constructor() {
  };

  @Command('broadcast-message', PublicMessage.fromMessage)
  broadcastMessage(payload: PublicMessage, message: IWebMessage<PublicMessage>) {
    console.log(payload, message);
  }

  @Command('private-message', PublicMessage.fromMessage)
  privateMessage(payload: PublicMessage, message: IWebMessage<PublicMessage>) {
    console.log(payload, message);
  }
}
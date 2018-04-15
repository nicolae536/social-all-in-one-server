import {Inject} from 'typescript-ioc';
import {Command, CommandController} from '../decorators';
import {PublicMessage, IWebMessage} from '../models';
import {IWebConnection} from './web-connection';

@CommandController
export class BroadcastMessagesController {
  @Inject
  private webSocketServer: IWebConnection;

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
import {IncomingMessage} from 'http';
import {IWebMessage, WebMessage} from './models';
import {WebControllerFactory, CommunicationError} from './utils';

export class RootMessageProcessor {
  static processMessage(message: string, request: IncomingMessage) {
    const webM: IWebMessage<string> = WebMessage.fromMessage(message);
    webM.ip = request.connection.remoteAddress;

    const processor = WebControllerFactory.getController(webM.type);
    if (processor) {
      return processor.processCommand(webM) as Promise<any>;
    }

    CommunicationError.unsuportedMessage(webM);
  }
}
import {IWebMessage, WebMessage} from './models';
import {WebMessageError, WebControllerFactory} from './utils';

export class RootMessageProcessor {
  static processMessage(message: string): void {
    const webM: IWebMessage<string> = WebMessage.fromMessage(message);

    const processor = WebControllerFactory.getController(webM.type);
    if (processor) {
      processor.processCommand(webM);
      return;
    }

    throw new WebMessageError('Unsupported message type');
  }
}
import {IWebMessage} from './web-message';

export interface IProcessMessage {
  processCommand(message: IWebMessage<string>): void;
}
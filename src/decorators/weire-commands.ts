import {IWebMessage} from '../models';
import {getCommandMetadata} from './command';


export function CommandController<T extends { new(...args: any[]): {} }>(constructor: T) {
  Object.defineProperty(constructor.prototype, 'processCommand', {
    writable: false,
    enumerable: false,
    configurable: false,
    value: function (message: IWebMessage<string>) {
      this[getCommandMetadata(message.type)](message);
    }
  });
}

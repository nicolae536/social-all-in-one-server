import {Container} from 'typescript-ioc';
import {IWebMessage} from '../models';
import {ImplementationError, CommunicationError} from '../utils';
import {getCommandMethodName} from './command';
import {AuthorizeControllerService} from './interfaces';

interface IControllerOptions {
  role?: any;
}

export function CommandController(options?: IControllerOptions) {
  return function <T extends { new(...args: any[]): {} }>(constructor: T) {
    Object.defineProperty(constructor.prototype, 'processCommand', {
      writable: false,
      enumerable: false,
      configurable: false,
      value: function (message: IWebMessage<string>) {
        if (!options || !options.role) {
          return this[getCommandMethodName(message.type)](message);
        }

        const authorizeService: AuthorizeControllerService = Container.get(AuthorizeControllerService);

        if (!authorizeService) {
          throw new ImplementationError('No authorization service provided');
        }

        if (!authorizeService.authorize(options.role)) {
          CommunicationError.notAuthorized();
        }

        return this[getCommandMethodName(message.type)](message);
      }
    });
  };
}

import {Container} from 'typescript-ioc';
import {IWebMessage} from '../models';
import {ImplementationError, CommunicationError} from '../utils';
import {AuthorizeCommandService} from './interfaces';

const META_COMMAND_KEY = '__process__command__';

export const PROCESSORS_MAP: Map<string, (...args) => void> = new Map<string, (...args) => void>();

export function getCommandMethodName(type: string) {
  return META_COMMAND_KEY + type;
}

interface ICommandOptions {
  role: any;
}

export function Command(command: string, modelBuilder: (s: string) => any, options?: ICommandOptions) {
  const metaKey = getCommandMethodName(command);

  return function (target: any, commandMethod: string, descriptor: PropertyDescriptor) {
    PROCESSORS_MAP.set(command, target.constructor);

    Object.defineProperty(target, metaKey, {
      enumerable: true,
      writable: false,
      value: function (message: IWebMessage<any>) {
        try {
          message.payload = JSON.parse(message.payload);
        } catch (e) {
          CommunicationError.unsuportedMessage(message);
        }


        if (!this[commandMethod]) {
          throw new ImplementationError('Command not implemented');
        }

        if (!options || !options.role) {
          return this[commandMethod](message.payload, message);
        }

        const authorizeService: AuthorizeCommandService = Container.get(AuthorizeCommandService);

        if (!authorizeService) {
          throw new ImplementationError('No authorization service provided');
        }

        if (!authorizeService.authorizeCommand(options.role)) {
          CommunicationError.notAuthorized();
        }

        return this[commandMethod](message.payload, message);
      }
    });
  };
}

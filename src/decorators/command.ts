import {IWebMessage} from '../models';

const META_COMMAND_KEY = '__process__command__';

export const PROCESSORS_MAP: Map<string, (...args) => void> = new Map<string, (...args) => void>();

export function getCommandMetadata(type: string) {
  return META_COMMAND_KEY + type;
}

export function Command(command: string, modelBuilder: (s: string) => any) {
  const metaKey = getCommandMetadata(command);

  return function (target: any, commandMethod: string, descriptor: PropertyDescriptor) {
    PROCESSORS_MAP.set(command, target.constructor);

    Object.defineProperty(target, metaKey, {
      enumerable: true,
      writable: false,
      value: function (message: IWebMessage<any>) {
        message.payload = modelBuilder(message.payload);
        if (!this[commandMethod]) {
          return;
        }

        this[commandMethod](message.payload, message);
      }
    });
  };
}

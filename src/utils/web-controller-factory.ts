import {Container} from 'typescript-ioc';
import {IProcessMessage} from '../models';
import {PROCESSORS_MAP} from '../decorators/command';

export class WebControllerFactory {
  static commandControllers: Map<string, (...args) => void> = PROCESSORS_MAP;

  static getControllerType(type: string) {
    return WebControllerFactory.commandControllers.get(type);
  }

  static getController(type: string): IProcessMessage | null {
    const constructor = WebControllerFactory.getControllerType(type);
    if (constructor) {
      return Container.get(constructor) as IProcessMessage || null;
    }

    return null;
  }
}
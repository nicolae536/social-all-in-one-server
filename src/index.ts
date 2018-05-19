import {Container, Scope} from 'typescript-ioc';
import {WebSocketServer} from './server';

const wsServer: WebSocketServer = Container.get(WebSocketServer);
Container.bind(WebSocketServer).provider({get: () => wsServer}).scope(Scope.Singleton);
wsServer.configure();
wsServer.start();
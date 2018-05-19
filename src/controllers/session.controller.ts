import {Inject, Container} from 'typescript-ioc';
import {DsSessionRepo, DsUsersRepo, DsSessionsRepoImpl, DsSessionModel, DsUsersRepoImpl} from '../datasource';
import {IDsUserModel} from '../datasource/models/users';
import {Command, CommandController} from '../decorators';
import {IWebMessage} from '../models';
import {LoginMessage} from '../models/login-message';
import {CommunicationError} from '../utils';
import {IWebConnection} from './web-connection';

@CommandController()
export class SessionController {
  @Inject
  private webSocketServer: IWebConnection;
  private sessionRepo: DsSessionRepo;
  private usersRepo: DsUsersRepo;

  constructor() {
    this.sessionRepo = Container.get(DsSessionsRepoImpl);
    this.usersRepo = Container.get(DsUsersRepoImpl);
  };

  @Command('sign-up', LoginMessage.fromSignupMessage)
  async signUp(payload: LoginMessage, message: IWebMessage<LoginMessage>) {
    const user = await this.usersRepo.create({
      hashPassword: payload.userPassword,
      userName: payload.userId,
      profile: null,
      termsAgreed: payload.termsAgreed,
      // is created by the repo
      salt: ''
    });

    const newSession = await this.createSession(user, message.ip);
    this.webSocketServer.replay(message, newSession.toJson());
  }

  @Command('login', LoginMessage.fromMessage)
  async login(payload: LoginMessage, message: IWebMessage<LoginMessage>) {
    const user = await this.usersRepo.findById(payload.userId, {password: payload.userPassword});

    if (!user) {
      CommunicationError.badRequest('Invalid username or password', payload);
    }

    const newSession = await this.createSession(user, message.ip);
    this.webSocketServer.replay(message, newSession.toJson());
  }

  @Command('logout', LoginMessage.fromMessage)
  async logout(payload: DsSessionModel, message: IWebMessage<DsSessionModel>) {
    await this.sessionRepo.remove({id: payload.id.toHexString()});
  }

  private async createSession(user: IDsUserModel, machineIp: string) {
    const today = new Date();
    const validUntil = new Date();
    validUntil.setMinutes(today.getMinutes() + 60);

    return await this.sessionRepo.create({
      id: null,
      createdDate: today.toUTCString(),
      validUntil: validUntil.toUTCString(),
      userId: user.userName,
      userInfo: machineIp
    });
  }
}
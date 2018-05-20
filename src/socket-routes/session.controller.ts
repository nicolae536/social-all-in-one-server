import {Container} from 'typescript-ioc';
import {DsSessionRepo, DsUsersRepo, DsSessionsRepoImpl, DsUsersRepoImpl} from '../datasource';
import {IDsUserModel} from '../datasource/models/users';
import {Command, CommandController} from '../decorators';
import {IWebMessage} from '../models';
import {LoginSignupMessage, LogoutMessage} from '../models/login-signup-message';
import {CommunicationError} from '../utils';

@CommandController()
export class SessionController {
  private sessionRepo: DsSessionRepo;
  private usersRepo: DsUsersRepo;

  constructor() {
    this.sessionRepo = Container.get(DsSessionsRepoImpl);
    this.usersRepo = Container.get(DsUsersRepoImpl);
  };

  @Command('sign-up', LoginSignupMessage.fromSignupMessage)
  async signUp(payload: LoginSignupMessage, request: IWebMessage<LoginSignupMessage>) {
    const user = await this.usersRepo.create({
      hashPassword: payload.userPassword,
      userName: payload.userId,
      profile: null,
      termsAgreed: payload.termsAgreed,
      // is created by the repo
      salt: ''
    });

    const newSession = await this.createSession(user, request.connectionDef.ip);
    request.connection.replay(request, newSession.toJson());
  }

  @Command('login', LoginSignupMessage.fromMessage)
  async login(payload: LoginSignupMessage, request: IWebMessage<LoginSignupMessage>) {
    const user = await this.usersRepo.findById(payload.userId, {password: payload.userPassword});

    if (!user) {
      CommunicationError.badRequest('Invalid username or password', payload);
    }

    const newSession = await this.createSession(user, request.connectionDef.ip);
    request.connection.replay(request, newSession.toJson());
  }

  @Command('logout', LogoutMessage.fromMessage)
  async logout(payload: LogoutMessage, request: IWebMessage<LogoutMessage>) {
    await this.sessionRepo.remove({id: payload.id});
    request.connection.replay(request, {sessionRevoked: true});
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
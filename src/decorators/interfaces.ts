export interface IAuthorizeController {
  authorize(userRights?: any): boolean;
}

export abstract class AuthorizeControllerService implements IAuthorizeController {
  abstract authorize(userRights?: any): boolean;
}

export interface IAuthorizeCommand {
  authorizeCommand(userRights?: any): boolean;
}

export abstract class AuthorizeCommandService implements IAuthorizeCommand {
  abstract authorizeCommand(userRights?: any): boolean;
}
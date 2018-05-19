export function convertToString(m: any): string {
  if (m === null || m === undefined) {
    return '';
  }

  if (m instanceof Object && !(typeof m === 'string')) {
    return JSON.stringify(m);
  }

  return '' + m;
}

export function toType<T>(data: any) {
  return data as T;
}

export abstract class ServerError extends Error {
  message: string;
  status: number;
  errorData: Object;

  toJson() {
    return {
      message: this.message || '',
      status: this.status || 404,
      errorData: this.errorData || {}
    };
  }

  stringify() {
    return JSON.stringify(this.toJson());
  }
}

export class ImplementationError extends ServerError {
  constructor(message: string,
              status?: number,
              data?: Object) {
    super(message);
    this.status = status;
    this.errorData = data;
    Object.setPrototypeOf(this, ImplementationError.prototype);
  }
}

export class CommunicationError extends ServerError {
  constructor(message: string,
              status?: number,
              data?: Object) {
    super(message);
    this.status = status;
    this.errorData = data;
    Object.setPrototypeOf(this, CommunicationError.prototype);
  }

  static notAuthorized(message?: string) {
    throw new CommunicationError(message || 'Not authorized', 401, null);
  }

  static badRequest(message: string, e?: any): CommunicationError {
    throw new CommunicationError(message, 400, e);
  }

  static unsuportedMessage(message?: any) {
    throw new CommunicationError('Invalid message type', 415, message);
  }

  static dbError<T>(e, model?: string): T {
    throw new CommunicationError(`Cannot make changes to ${model ? model + 'collection in ' : ''} database`, 500, e);
  }
}

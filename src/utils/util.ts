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

export class WebMessageError extends Error {
  constructor(message: string,
              public status?: string) {
    super(message);
    Object.setPrototypeOf(this, WebMessageError.prototype);
  }
}
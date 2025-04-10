/* eslint-disable */
declare module 'jsonwebtoken' {
  type StringValue = string;

  export interface SignOptions {
    expiresIn?: number | StringValue;
    [key: string]: unknown;
  }

  export interface VerifyOptions {
    [key: string]: unknown;
  }

  export function sign(
    payload: string | object | Buffer,
    secretOrPrivateKey: string | Buffer,
    options?: SignOptions,
  ): string;

  export function verify(
    token: string,
    secretOrPublicKey: string | Buffer,
    options?: VerifyOptions,
  ): string | object;
}

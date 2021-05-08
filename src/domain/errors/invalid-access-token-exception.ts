export class InvalidAccessTokenException extends Error {
  constructor() {
    super();
    this.name = 'InvalidAccessTokenException';
  }
}

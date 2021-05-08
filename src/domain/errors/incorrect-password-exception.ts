export class IncorrectPasswordException extends Error {
  constructor() {
    super();
    this.name = 'IncorrectPasswordException';
  }
}

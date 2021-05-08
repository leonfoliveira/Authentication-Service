export class EmailInUseException extends Error {
  constructor() {
    super();
    this.name = 'EmailInUseException';
  }
}

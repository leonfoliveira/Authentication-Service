export class EmailAlreadyConfirmedException extends Error {
  constructor() {
    super();
    this.name = 'EmailAlreadyConfirmedException';
  }
}

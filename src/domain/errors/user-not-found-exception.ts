export class UserNotFoundException extends Error {
  constructor() {
    super();
    this.name = 'UserNotFoundException';
  }
}

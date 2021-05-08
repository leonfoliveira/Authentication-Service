import { StatelessTokenDecoder } from '@/application/interfaces';
import { InvalidAccessTokenException } from '@/domain/errors';
import { User } from '@/domain/models';
import { DecodeAccessToken } from '@/domain/usecases';

export class LocalDecodeAccessToken implements DecodeAccessToken {
  constructor(private readonly statelessTokenDecoder: StatelessTokenDecoder) {}

  decode(accessToken: string): User {
    const user = this.statelessTokenDecoder.decode(accessToken);
    if (!user) {
      throw new InvalidAccessTokenException();
    }

    return user as User;
  }
}

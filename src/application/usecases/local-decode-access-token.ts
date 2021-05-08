import { StatelessTokenDecoder } from '@/application/interfaces';
import { User } from '@/domain/models';
import { DecodeAccessToken } from '@/domain/usecases';

export class LocalDecodeAccessToken implements DecodeAccessToken {
  constructor(private readonly statelessTokenDecoder: StatelessTokenDecoder) {}

  decode(accessToken: string): User {
    const user = this.statelessTokenDecoder.decode(accessToken);
    if (!user) {
      throw new Error('INVALID_ACCESS_TOKEN');
    }

    return user as User;
  }
}

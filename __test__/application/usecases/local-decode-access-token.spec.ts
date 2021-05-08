import faker from 'faker';
import { mock, MockProxy } from 'jest-mock-extended';

import { StatelessTokenDecoder } from '@/application/interfaces';
import { LocalDecodeAccessToken } from '@/application/usecases';
import { InvalidAccessTokenException } from '@/domain/errors';
import { mockUser } from '@/test/domain/models';
import { getReturn } from '@/test/helpers';

type SutTypes = {
  sut: LocalDecodeAccessToken;
  statelessTokenDecoderSpy: MockProxy<StatelessTokenDecoder>;
};

const makeSut = (): SutTypes => {
  const statelessTokenDecoderSpy = mock<StatelessTokenDecoder>({
    decode: jest.fn().mockReturnValue(mockUser()),
  });
  const sut = new LocalDecodeAccessToken(statelessTokenDecoderSpy);

  return { sut, statelessTokenDecoderSpy };
};

describe('LocalDecodeAccessToken', () => {
  it('should call StatelessTokenDecoder with correct params', () => {
    const { sut, statelessTokenDecoderSpy } = makeSut();
    const accessToken = faker.datatype.uuid();

    sut.decode(accessToken);

    expect(statelessTokenDecoderSpy.decode).toHaveBeenCalledWith(accessToken);
  });

  it('should throw INVALID_ACCESS_TOKEN if StatelessTokenDecoder returns null', () => {
    const { sut, statelessTokenDecoderSpy } = makeSut();
    statelessTokenDecoderSpy.decode.mockReturnValue(null);

    expect(() => sut.decode(faker.datatype.uuid())).toThrow(new InvalidAccessTokenException());
  });

  it('should return the same as StatelessTokenDecoder', () => {
    const { sut, statelessTokenDecoderSpy } = makeSut();

    const result = sut.decode(faker.datatype.uuid());

    expect(result).toEqual(getReturn(statelessTokenDecoderSpy.decode));
  });
});

import faker from 'faker';
import { mock, MockProxy } from 'jest-mock-extended';

import { FindUserRepository, UserGrantAdminRepository } from '@/application/interfaces';
import { DbGrantAdmin } from '@/application/usecases';
import { mockUser } from '@/test/domain/models';

type SutTypes = {
  sut: DbGrantAdmin;
  findUserRepository: MockProxy<FindUserRepository>;
  userGrantAdminRepository: MockProxy<UserGrantAdminRepository>;
};

const makeSut = (): SutTypes => {
  const findUserRepository = mock<FindUserRepository>({
    find: jest.fn().mockResolvedValue(mockUser()),
  });
  const userGrantAdminRepository = mock<UserGrantAdminRepository>();
  const sut = new DbGrantAdmin(findUserRepository, userGrantAdminRepository);

  return { sut, findUserRepository, userGrantAdminRepository };
};

const mockDTO = faker.datatype.uuid;

describe('DbGrantAdmin', () => {
  it('should call FindUserRepository with correct params', async () => {
    const { sut, findUserRepository } = makeSut();
    const id = mockDTO();

    await sut.grant(id);

    expect(findUserRepository.find).toHaveBeenCalledWith(id);
  });

  it('should throw if FindUserRepository returns null', async () => {
    const { sut, findUserRepository } = makeSut();
    findUserRepository.find.mockResolvedValueOnce(null);

    const promise = sut.grant(mockDTO());

    await expect(promise).rejects.toThrow(new Error('USER_NOT_FOUND'));
  });

  it('should call UserGrantAdminRepository with correct params', async () => {
    const { sut, userGrantAdminRepository } = makeSut();
    const id = mockDTO();

    await sut.grant(id);

    expect(userGrantAdminRepository.grant).toHaveBeenCalledWith(id);
  });
});

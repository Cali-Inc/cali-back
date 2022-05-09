import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import PrismaService from 'prisma/prisma.service';
import { UserExceptions } from 'utils/exceptions';
import UserService from 'user/user.service';

const userArray: User[] = [
  {
    id: 1,
    email: 'test@example.com',
    username: 'test',
    walletAddress: '0xa1ds56dsa456a2dsd5a89tes3te',
    telegram: 'test',
    createdAt: new Date('2022-03-24 02:05:18.084'),
    updatedAt: new Date('2022-03-24 02:05:18.087'),
  },
  {
    id: 2,
    email: 'test2@example.com',
    username: 'test2',
    walletAddress: '0xad3s56dsa456a1dsd5a89tes3te2',
    telegram: 'test2',
    createdAt: new Date('2022-03-24 02:05:18.084'),
    updatedAt: new Date('2022-03-24 02:05:18.087'),
  },
  {
    id: 3,
    email: 'test3@example.com',
    username: 'test3',
    walletAddress: '0xa2ds56dsa456ads1d5a89te4ste3',
    telegram: 'test3',
    createdAt: new Date('2022-03-24 02:05:18.084'),
    updatedAt: new Date('2022-03-24 02:05:18.087'),
  },
];
const userOne = userArray[0];

const db = {
  user: {
    findMany: jest.fn().mockResolvedValue(userArray),
    findUnique: jest.fn().mockResolvedValue(userOne),
    findFirst: jest.fn().mockResolvedValue(userOne),
    create: jest.fn().mockResolvedValue('User created successfully.'),
    save: jest.fn(),
    update: jest.fn().mockResolvedValue(userOne),
    delete: jest.fn().mockResolvedValue(userOne),
  },
};

const omittedUser: Omit<User, 'createdAt' | 'updatedAt'> = userOne;

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: PrismaService, useValue: db }],
    }).compile();
    // const module: TestingModule = await Test.createTestingModule({
    //   providers: [UserService, PrismaService],
    // }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined (service)', () => expect(service).toBeDefined());
  it('should be defined (prisma)', () => expect(prisma).toBeDefined());

  describe('create user', () => {
    /**
     * This test should test user creation with no errors/exceptions
     */
    it('should create an user', async () => {
      const notFoundSpy = jest
        .spyOn(prisma.user, 'findUnique')
        .mockResolvedValueOnce(null);

      await expect(
        service.create({
          walletAddress: userOne.walletAddress,
        }),
      ).resolves.toBe('User created successfully.');

      expect(notFoundSpy).toHaveBeenCalled();

      notFoundSpy.mockRestore();
    });

    /**
     * This test should test user creation with get exception by already existing user
     */
    it('should try create an user and get exception', async () => {
      const foundSpy = jest
        .spyOn(prisma.user, 'findUnique')
        .mockResolvedValue(userOne);

      await expect(
        service.create({ walletAddress: userOne.walletAddress }),
      ).rejects.toThrow(new UserExceptions('already-exists'));

      expect(foundSpy).toHaveBeenCalled();

      foundSpy.mockRestore();
    });
  });

  describe('update user', () => {
    /**
     * This test should update an user data
     */
    it('should update an user', async () => {
      const foundSpy = jest
        .spyOn(prisma.user, 'findUnique')
        .mockResolvedValueOnce(userOne);

      await expect(
        service.update(userOne, { email: 'aasddda@dasdad.com' }),
      ).resolves.toBe('User updated successfully.');

      expect(foundSpy).toHaveBeenCalled();
      foundSpy.mockRestore();
    });

    /**
     * This test should not update an user data because the user could not be found
     */
    it('should not update an user because it could not find', async () => {
      const foundSpy = jest
        .spyOn(prisma.user, 'findUnique')
        .mockResolvedValueOnce(null);

      await expect(
        service.update(userOne, { email: 'asdadasdas@dasda.com' }),
      ).rejects.toThrow(new UserExceptions('not-found'));

      expect(foundSpy).toHaveBeenCalled();
      foundSpy.mockRestore();
    });
  });

  describe('find user', () => {
    /**
     * This test should find an user data
     */
    it('should find an user', async () => {
      const foundSpy = jest
        .spyOn(prisma.user, 'findUnique')
        .mockResolvedValueOnce(userOne);

      await expect(service.find(omittedUser)).resolves.toBe(userOne);

      expect(foundSpy).toHaveBeenCalled();
      foundSpy.mockRestore();
    });

    /**
     * This test should not find an user data because the user could not be found
     */
    it('should not find an user because he does not exists', async () => {
      const foundSpy = jest
        .spyOn(prisma.user, 'findUnique')
        .mockResolvedValueOnce(null);

      await expect(service.find(omittedUser)).rejects.toThrow(
        new UserExceptions('not-found'),
      );

      expect(foundSpy).toHaveBeenCalled();
      foundSpy.mockRestore();
    });
  });
});

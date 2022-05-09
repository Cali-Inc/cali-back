import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import PrismaService from 'prisma/prisma.service';
import { DefaultResponse } from 'utils/responses';

import { UpdateUserDTO, CreateUserDTO } from './dto';
import { UserExceptions } from '../utils/exceptions';

@Injectable()
class UserService {
  constructor(private readonly prisma: PrismaService) {
    this.prisma = prisma;
  }

  async find(query: Partial<User>) {
    const { walletAddress, id } = query;
    const user = await this.prisma.user.findUnique({
      where: {
        walletAddress,
        id,
      },
    });

    if (!user) {
      throw new UserExceptions('not-found');
    }

    return DefaultResponse('User found successfully.', user);
  }

  async create(user: CreateUserDTO) {
    const { walletAddress } = user;

    const findUser = await this.prisma.user.findUnique({
      where: {
        walletAddress,
      },
    });

    if (findUser) {
      throw new UserExceptions('already-exists');
    }

    const userCreated = await this.prisma.user.create({
      data: {
        walletAddress,
      },
    });
    return DefaultResponse('User created successfully.', userCreated);
  }

  async update(user: User, fieldsToChange: UpdateUserDTO) {
    const { id } = user;

    const userUpdated = await this.prisma.user
      .update({
        where: {
          id,
        },
        data: fieldsToChange,
      })
      .catch(() => {
        throw new UserExceptions('could-not-update');
      });

    return { message: 'User updated successfully.', data: userUpdated };
  }
}
export default UserService;

/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
import { Injectable } from '@nestjs/common';
import { Auth } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import PrismaService from 'prisma/prisma.service';
import UserService from 'user/user.service';
import { jwtConfig } from 'configs';
import {
  AuthExceptions,
  DefaultResponse,
  generateNonce,
  verifySign,
} from 'utils';

import { AuthDTO } from './dto';

@Injectable()
class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {
    this.prisma = prisma;
    this.userService = userService;
    this.jwtService = jwtService;
  }

  // async createNonce(walletAddress: string){

  // }
  async create(id: number) {
    const nonce = await generateNonce();
    const authCreated = await this.prisma.auth.create({
      data: {
        userId: id,
        nonce,
      },
    });
    return authCreated;
  }

  // }
  async update(query: Partial<Auth>) {
    const { id, nonce, userId } = query;

    const updatedAuth = await this.prisma.auth.upsert({
      where: { id },
      update: { nonce },
      create: {
        nonce,
        userId,
      },
    });

    return updatedAuth;
  }

  async find(walletAddress: string) {
    let userFound = await this.prisma.user.findUnique({
      where: { walletAddress },
    });
    if (!userFound) {
      userFound = (await this.userService.create({ walletAddress })).data;
    }
    const { id } = userFound;
    let authFound = await this.prisma.auth.findUnique({
      where: {
        userId: id,
      },
    });
    if (!authFound) authFound = await this.create(id);

    return authFound;
  }

  async renewNonce(walletAddress: string) {
    const authFound = await this.find(walletAddress);

    const nonce = await generateNonce();

    authFound.nonce = nonce;

    await this.update(authFound);

    return nonce;
  }

  async getNonce(walletAddress: string) {
    const nonce = await this.renewNonce(walletAddress);

    return DefaultResponse('Nonce created successfully.', nonce);
  }

  async authNonce(authData: AuthDTO) {
    const { walletAddress, signature } = authData;

    const { nonce } = await this.find(walletAddress);

    const signatureVerification = verifySign(nonce, signature);

    if (signatureVerification.toLowerCase() !== walletAddress.toLowerCase())
      throw new AuthExceptions('unauthorized');

    const jwtSign = this.jwtService.sign(
      { walletAddress },
      {
        expiresIn: jwtConfig.signOptions.expiresIn,
        secret: jwtConfig.secret,
      },
    );
    await this.renewNonce(walletAddress);
    return DefaultResponse('User authorized.', jwtSign);
  }
}
export default AuthService;

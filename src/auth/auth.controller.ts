/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
/* eslint-disable no-unused-vars */
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DefaultResponse } from 'utils';
import AuthService from './auth.service';
import { AuthDTO } from './dto';

@Controller('auth')
class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  async showNonce(@Query('walletAddress') walletAddress: string) {
    return this.authService.getNonce(walletAddress);
  }

  @Post()
  async authSignature(@Body() auth: AuthDTO) {
    return this.authService.authNonce(auth);
  }
}
export default AuthController;

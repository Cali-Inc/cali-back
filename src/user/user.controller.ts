/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
/* eslint-disable no-unused-vars */
import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtAuthGuard } from 'auth/guards';
import { Request } from 'express';
import { UpdateUserDTO, CreateUserDTO } from './dto';
import UserService from './user.service';

@Controller('user')
class UserController {
  constructor(private readonly userService: UserService) {}

  // @Get()
  // getHello(): string {
  //   return this.userService.getHello();
  // }

  @Post()
  async createUser(@Body() post: CreateUserDTO) {
    return this.userService.create(post);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateUser(@Body() update: UpdateUserDTO, @Req() req: Request) {
    const user: User = <User>req.user;
    return this.userService.update(user, update);
  }
}
export default UserController;

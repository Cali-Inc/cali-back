import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import AuthModule from 'auth/auth.module';
import UserModule from 'user/user.module';

@Module({
  imports: [UserModule, AuthModule, ConfigModule.forRoot()],
  controllers: [],
  providers: [],
})
class AppModule {}

export default AppModule;

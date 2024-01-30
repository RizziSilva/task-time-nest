import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from '@controllers';
import { AuthService, LocalStrategy } from '@services';
import { AuthMapper } from '@mappers';
import { UserModule } from './user.module';

@Module({
  imports: [UserModule, PassportModule],
  controllers: [AuthController],
  providers: [AuthService, AuthMapper],
  exports: [LocalStrategy],
})
export class AuthModule {}

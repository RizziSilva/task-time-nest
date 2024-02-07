import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from '@controllers';
import { AuthService, JwtStrategy, LocalStrategy } from '@services';
import { AuthMapper } from '@mappers';
import { ACCESS_TOKEN_EXPIRATION_TIME } from '@constants';
import { UserModule } from './user.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      signOptions: { expiresIn: ACCESS_TOKEN_EXPIRATION_TIME },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthMapper, LocalStrategy, JwtStrategy],
})
export class AuthModule {}

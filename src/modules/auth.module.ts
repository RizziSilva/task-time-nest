import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from '@controllers';
import { AuthService, JwtStrategy, LocalStrategy } from '@services';
import { AuthMapper } from '@mappers';
import { UserModule } from './user.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthMapper, LocalStrategy, JwtStrategy],
})
export class AuthModule {}

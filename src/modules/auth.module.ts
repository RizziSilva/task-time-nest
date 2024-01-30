import { Module } from '@nestjs/common';
import { AuthController } from '@controllers';
import { AuthService } from '@services';
import { AuthMapper } from '@mappers';
import { UserModule } from './user.module';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, AuthMapper],
})
export class AuthModule {}

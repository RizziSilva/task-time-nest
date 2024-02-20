import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from '@controllers';
import { UserService } from '@services';
import { UserMapper } from '@mappers';
import { User } from '@entities';
import { UserValidator } from '@validators';
import { AuthModule } from './auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [forwardRef(() => AuthModule), TypeOrmModule.forFeature([User]), JwtModule.register({})],
  controllers: [UserController],
  providers: [UserService, UserMapper, UserValidator],
  exports: [UserService, UserMapper],
})
export class UserModule {}

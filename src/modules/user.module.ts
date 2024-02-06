import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from '@controllers';
import { UserService } from '@services';
import { UserMapper } from '@mappers';
import { User } from '@entities';
import { UserCreateValidator } from '@validators';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, UserMapper, UserCreateValidator],
  exports: [UserService, UserMapper],
})
export class UserModule {}

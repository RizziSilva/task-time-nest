import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from '@controllers';
import { UserService } from '@services';
import { UserMapper } from '@mappers';
import { User } from '@entities';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, UserMapper],
})
export class UserModule {}

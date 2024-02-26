import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { TaskController } from '@controllers';
import { TaskService } from '@services';
import { Task } from '@entities';
import { TaskValidator } from '@validators';
import { TaskMapper } from '@mappers';
import { AuthModule } from './auth.module';
import { UserModule } from './user.module';

@Module({
  imports: [UserModule, AuthModule, TypeOrmModule.forFeature([Task]), JwtModule.register({})],
  controllers: [TaskController],
  providers: [TaskService, TaskMapper, TaskValidator],
})
export class TaskModule {}

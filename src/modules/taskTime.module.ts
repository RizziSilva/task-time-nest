import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskTime } from '@entities';
import { TaskTimeController } from '@controllers';
import { TaskTimeMapper } from '@mappers';
import { TaskTimeValidator } from '@validators';
import { TaskTimeService } from '@services';
import { UserModule } from './user.module';
import { AuthModule } from './auth.module';
import { TaskModule } from './task.module';

@Module({
  imports: [
    forwardRef(() => TaskModule),
    UserModule,
    AuthModule,
    TypeOrmModule.forFeature([TaskTime]),
    JwtModule.register({}),
  ],
  controllers: [TaskTimeController],
  providers: [TaskTimeMapper, TaskTimeService, TaskTimeValidator],
  exports: [TaskTimeService],
})
export class TaskTimeModule {}

import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserJwtAuthGuard } from '@guards';
import {
  AuthLoginResponseDto,
  CreateTaskRequestDto,
  CreateTaskResponseDto,
  UpdateTaskRequestDto,
  UpdateTaskResponseDto,
} from '@dtos';
import { RequestUser } from '@decorators';
import { TaskService } from '@services';

@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @UseGuards(UserJwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createTask(
    @RequestUser() user: AuthLoginResponseDto,
    @Body() request: CreateTaskRequestDto,
  ): Promise<CreateTaskResponseDto> {
    return await this.taskService.create(user, request);
  }

  @UseGuards(UserJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Put(':taskId')
  async updateTask(
    @Param('taskId') taskId: number,
    @Body() request: UpdateTaskRequestDto,
  ): Promise<UpdateTaskResponseDto> {
    return await this.taskService.update(taskId, request);
  }

  @UseGuards(UserJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Put(':taskId')
  async deleteTask(@Param('taskId') taskId: number): Promise<void> {
    await this.taskService.deleteTask(taskId);
  }
}

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
import {
  CreateTaskTimeRequestDto,
  CreateTaskTimeResponseDto,
  UpdateTaskTimeRequestDto,
  UpdateTaskTimeResponseDto,
} from '@dtos';
import { UserJwtAuthGuard } from '@guards';
import { TaskTimeService } from '@services';

@Controller('task-time')
export class TaskTimeController {
  constructor(private taskTimeService: TaskTimeService) {}

  @UseGuards(UserJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Put(':taskTimeId')
  async updateTaskTime(
    @Param('taskTimeId') taskTimeId: number,
    @Body() request: UpdateTaskTimeRequestDto,
  ): Promise<UpdateTaskTimeResponseDto> {
    return await this.taskTimeService.updateTaskTime(request, taskTimeId);
  }

  @UseGuards(UserJwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createTaskTime(
    @Body() request: CreateTaskTimeRequestDto,
  ): Promise<CreateTaskTimeResponseDto> {
    return await this.taskTimeService.createTaskTime(request);
  }
}

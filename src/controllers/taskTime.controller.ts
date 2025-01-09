import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  AuthLoginResponseDto,
  CreateTaskTimeRequestDto,
  CreateTaskTimeResponseDto,
  GetPaginatedTaskRequestDto,
  GetPaginatedTaskTimeRequestDto,
  UpdateTaskTimeRequestDto,
  UpdateTaskTimeResponseDto,
} from '@dtos';
import { UserJwtAuthGuard } from '@guards';
import { TaskTimeService } from '@services';
import { RequestUser } from '@decorators';

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

  @UseGuards(UserJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Delete(':taskTimeId')
  async deleteTaskTime(@Param('taskTimeId') taskTimeId: number): Promise<void> {
    await this.taskTimeService.deleteTaskTime(taskTimeId);
  }

  @UseGuards(UserJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('paginated')
  async getTaskPaginated(
    @RequestUser() user: AuthLoginResponseDto,
    @Query() request: GetPaginatedTaskTimeRequestDto,
  ): Promise<GetPaginatedTaskResponseDto> {
    return await this.taskService.getPaginatedTasks(request, user);
  }
}

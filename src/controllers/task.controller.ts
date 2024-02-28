import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { UserJwtAuthGuard } from '@guards';
import { AuthLoginResponseDto, CreateTaskRequestDto, CreateTaskResponseDto } from '@dtos';
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
}

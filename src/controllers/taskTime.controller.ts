import { Body, Controller, HttpCode, HttpStatus, Param, Put, UseGuards } from '@nestjs/common';
import { UpdateTaskTimeRequestDto, UpdateTaskTimeResponseDto } from '@dtos';
import { UserJwtAuthGuard } from '@guards';
import { TaskTimeService } from '@services';

@Controller('task-time')
export class TaskTimeController {
  constructor(private taskTimeService: TaskTimeService) {}

  @UseGuards(UserJwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Put(':taskTimeId')
  async updateTaskTime(
    @Param('taskTimeId') taskTimeId: number,
    @Body() request: UpdateTaskTimeRequestDto,
  ): Promise<UpdateTaskTimeResponseDto> {
    return await this.taskTimeService.updateTaskTime(request, taskTimeId);
  }
}

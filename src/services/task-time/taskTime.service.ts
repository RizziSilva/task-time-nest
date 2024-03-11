import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateTaskTimeResponseDto,
  UpdateTaskTimeRequestDto,
  UpdateTaskTimeResponseDto,
} from '@dtos';
import { TaskTime } from '@entities';
import { CreateTaskTimeRequestDto } from '@dtos';
import { TaskTimeValidator } from '@validators';
import { TaskTimeMapper } from '@mappers';
import { calculateDifferenceInSeconds } from '@utils';

@Injectable()
export class TaskTimeService {
  constructor(
    @InjectRepository(TaskTime) private taskTimeRepository: Repository<TaskTime>,
    private taskTimeValidator: TaskTimeValidator,
    private taskTimeMapper: TaskTimeMapper,
  ) {}

  async createTaskTime(request: CreateTaskTimeRequestDto): Promise<CreateTaskTimeResponseDto> {
    this.taskTimeValidator.validateTaskTimeCreateRequest(request);

    const timeSpent: number = calculateDifferenceInSeconds(request.initiatedAt, request.endedAt);
    const taskTime: TaskTime = this.taskTimeMapper.fromCreateTaskTimeToTaskTime(request, timeSpent);
    const entityResponse: TaskTime = await this.taskTimeRepository.save(taskTime);
    const response: CreateTaskTimeResponseDto =
      this.taskTimeMapper.fromTaskTimeToCreateTaskTimeResponse(entityResponse);

    return response;
  }

  async updateTaskTime(
    request: UpdateTaskTimeRequestDto,
    taskTimeId: number,
  ): Promise<UpdateTaskTimeResponseDto> {
    this.taskTimeValidator.validateTaskTimeUpdateRequest(request, taskTimeId);

    const timeSpent: number = calculateDifferenceInSeconds(request.initiatedAt, request.endedAt);
    const taskTime: TaskTime = this.taskTimeMapper.fromUpdateTaskTimeRequestToTaskTime(
      request,
      timeSpent,
    );
    const entityResponse: TaskTime = await this.updateById(taskTime, taskTimeId);
    const response: UpdateTaskTimeResponseDto =
      this.taskTimeMapper.fromTaskTimeToUpdateTaskTimeResponse(entityResponse);

    return response;
  }

  async updateById(entity: TaskTime, id: number): Promise<TaskTime> {
    await this.taskTimeRepository.update({ id }, entity);
    const taskTime: TaskTime = await this.taskTimeRepository.findOneBy({ id });

    return taskTime;
  }
}

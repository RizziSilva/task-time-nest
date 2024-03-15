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
import { DeleteTaskTimeException, UpdateTaskTimeException } from '@exceptions';
import { DELETE_TASK_TIME_NOT_FOUND, UPDATE_TASK_TIME_MISSING_TASK_TIME } from '@constants';

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
    const currentTaskTime: TaskTime = await this.findOneById(taskTimeId);

    if (!currentTaskTime)
      throw new UpdateTaskTimeException(`${UPDATE_TASK_TIME_MISSING_TASK_TIME}${taskTimeId}.`);

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

  async deleteTaskTime(taskTimeId: number): Promise<void> {
    this.taskTimeValidator.validateTaskTimeDelete(taskTimeId);

    const taskTime: TaskTime = await this.findOneById(taskTimeId);

    if (!taskTime) throw new DeleteTaskTimeException(`${DELETE_TASK_TIME_NOT_FOUND}${taskTimeId}.`);

    await this.taskTimeRepository.delete({ id: taskTimeId });
  }

  async deleteAllTaskTimeByTaskId(taskId: number): Promise<void> {
    await this.taskTimeRepository.delete({ taskId });
  }

  async findOneById(id: number): Promise<TaskTime> {
    const taskTime: TaskTime = await this.taskTimeRepository.findOneBy({ id });

    return taskTime;
  }

  async updateById(entity: TaskTime, id: number): Promise<TaskTime> {
    await this.taskTimeRepository.update({ id }, entity);
    const taskTime: TaskTime = await this.findOneById(id);

    return taskTime;
  }

  async findClosestDayByUserId(userId: number): Promise<string> {
    return await this.taskTimeRepository.manager.query(`
      select MAX(tt.ended_at) from taskTime tt 
      inner join task t on tt.id_task = t.id 
      WHERE t.id_user = ${userId}
    `);
  }
}

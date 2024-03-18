import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '@entities';
import {
  AuthLoginResponseDto,
  CreateTaskRequestDto,
  CreateTaskResponseDto,
  CreateTaskTimeRequestDto,
  CreateTaskTimeResponseDto,
  GetPaginatedTaskRequestDto,
  GetPaginatedTaskResponseDto,
  UpdateTaskRequestDto,
  UpdateTaskResponseDto,
} from '@dtos';
import { TaskValidator } from '@validators';
import { DeleteTaskException, UpdateTaskException } from '@exceptions';
import { TaskMapper } from '@mappers';
import { DELETE_TASK_NOT_FOUND, UPDATE_TASK_EXCEPTION_TASK_NOT_FOUND } from '@constants';
import { TaskAndTime, TasksPagination, UpdateTask } from '@interfaces';
import { getTaskOffsetByPage } from '@utils';
import { TaskTimeService } from '../task-time/taskTime.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
    private taskValidator: TaskValidator,
    private taskMapper: TaskMapper,
    private taskTimeService: TaskTimeService,
  ) {}

  async create(
    user: AuthLoginResponseDto,
    request: CreateTaskRequestDto,
  ): Promise<CreateTaskResponseDto> {
    this.taskValidator.validateCreateTaskRequest(request);

    const newTask: Task = this.taskMapper.fromCreateRequestToTask(user.id, request);
    const entityResponse: Task = await this.taskRepository.save(newTask);
    const taskTimeRequest: CreateTaskTimeRequestDto =
      this.taskMapper.fromCreateRequestToCreateTaskTimeRequest(request, entityResponse.id);
    const taskTime: CreateTaskTimeResponseDto = await this.taskTimeService.createTaskTime(
      taskTimeRequest,
    );
    const response: CreateTaskResponseDto = this.taskMapper.fromTaskAndTaskTimeToCreateTaskResponse(
      entityResponse,
      taskTime,
    );

    return response;
  }

  async update(taskId: number, request: UpdateTaskRequestDto): Promise<UpdateTaskResponseDto> {
    this.taskValidator.validateUpdateTaskRequest(taskId);

    const task: Task = await this.findOneById(taskId);

    if (!task) throw new UpdateTaskException(UPDATE_TASK_EXCEPTION_TASK_NOT_FOUND);

    const updateTask: UpdateTask = this.taskMapper.fromTaskUpdateRequestToUpdateTask(request);
    const updatedTask: Task = await this.updateById(taskId, updateTask);
    const response: UpdateTaskResponseDto =
      this.taskMapper.fromTaskToTaskUpdateResponse(updatedTask);

    return response;
  }

  async deleteTask(taskId: number): Promise<void> {
    this.taskValidator.validateDeleteTask(taskId);

    const task: Task = await this.findOneById(taskId);

    if (!task) throw new DeleteTaskException(DELETE_TASK_NOT_FOUND);

    await this.taskTimeService.deleteAllTaskTimeByTaskId(taskId);
    await this.taskRepository.delete({ id: taskId });
  }

  async getPaginatedTasks(request: GetPaginatedTaskRequestDto): Promise<void> {
    const pagination: TasksPagination = getTaskOffsetByPage(request.page);
    const taskAndTimes: Array<TaskAndTime> = await this.getTasksAndTaskTimesByUserAndPage(
      request.userId,
      pagination,
    );
  }

  async findOneById(id: number): Promise<Task> {
    return await this.taskRepository.findOneBy({ id: id });
  }

  async updateById(id: number, newTask: UpdateTask): Promise<Task> {
    await this.taskRepository.update({ id }, { ...newTask });
    const task: Task = await this.findOneById(id);

    return task;
  }

  async getTasksAndTaskTimesByUserAndPage(
    userId: number,
    pagination: TasksPagination,
  ): Promise<Array<TaskAndTime>> {
    return await this.taskRepository.manager.query(`
      select t.id as taskId, t.title, t.description, t.link, tt.time_spent, tt.id as taskTimeId, tt.initiated_at, tt.ended_at from taskTime tt
      inner join task t on t.id = tt.id_task
      WHERE t.id_user = ${userId} 
      ORDER BY t.created_at DESC
      LIMIT ${pagination.initial}, ${pagination.end};
    `);
  }
}

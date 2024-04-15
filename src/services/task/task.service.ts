import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskTime } from '@entities';
import {
  AuthLoginResponseDto,
  CreateTaskRequestDto,
  CreateTaskResponseDto,
  CreateTaskTimeRequestDto,
  CreateTaskTimeResponseDto,
  GetPaginatedTaskRequestDto,
  GetPaginatedTaskResponseDto,
  GetTaskResponseDto,
  UpdateTaskRequestDto,
  UpdateTaskResponseDto,
} from '@dtos';
import { TaskValidator } from '@validators';
import { DeleteTaskException, GetTaskException, UpdateTaskException } from '@exceptions';
import { TaskMapper } from '@mappers';
import {
  DELETE_TASK_NOT_FOUND,
  GET_TASK_NOT_FOUND,
  NUMBER_OF_ENTRIES_PER_PAGE,
  UPDATE_TASK_EXCEPTION_TASK_NOT_FOUND,
} from '@constants';
import { TaskAndTime, TasksPagination, UpdateTask } from '@interfaces';
import { getTaskOffsetByPage } from '@utils';
import { TaskTimeService } from '../task-time/taskTime.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
    private taskValidator: TaskValidator,
    private taskMapper: TaskMapper,
    @Inject(forwardRef(() => TaskTimeService)) private taskTimeService: TaskTimeService,
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

    await this.taskRepository.remove(task);
  }

  async getPaginatedTasks(
    request: GetPaginatedTaskRequestDto,
    user: AuthLoginResponseDto,
  ): Promise<GetPaginatedTaskResponseDto> {
    console.log('userId', user.id);
    const pagination: TasksPagination = getTaskOffsetByPage(request.page);
    const taskAndTimes: Array<Task> = await this.getTasksAndTaskTimesByUserAndPage(
      user.id,
      pagination,
    );
    const userNumberOfTasks: number = await this.countTasksByUserId(user.id);
    const response: GetPaginatedTaskResponseDto =
      this.taskMapper.fromTasksToGetPaginatedTasksResponse(
        taskAndTimes,
        request.page,
        userNumberOfTasks,
      );

    return response;
  }

  async getTask(taskId: number): Promise<GetTaskResponseDto> {
    this.taskValidator.validateGetTask(taskId);

    const task: Task = await this.findOneById(taskId);

    if (!task) throw new GetTaskException(`${GET_TASK_NOT_FOUND}${taskId}.`);

    const response: GetTaskResponseDto = this.taskMapper.fromTaskToGetTaskResponseDto(task);

    return response;
  }

  async findOneById(id: number): Promise<Task> {
    return await this.taskRepository.findOne({
      relations: {
        times: true,
      },
      where: [{ id }],
    });
  }

  async updateById(id: number, newTask: UpdateTask): Promise<Task> {
    await this.taskRepository.update({ id }, { ...newTask });
    const task: Task = await this.findOneById(id);

    return task;
  }

  async getTasksAndTaskTimesByUserAndPage(
    userId: number,
    pagination: TasksPagination,
  ): Promise<Array<Task>> {
    console.log('userId', userId);
    return await this.taskRepository.find({
      relations: {
        times: true,
      },
      where: [{ idUser: userId }],
      order: {
        createdAt: 'DESC',
      },
      skip: pagination.initial,
      take: NUMBER_OF_ENTRIES_PER_PAGE,
    });
  }

  async countTasksByUserId(idUser: number): Promise<number> {
    const numberOfTasks: number = await this.taskRepository.count({ where: [{ idUser }] });

    return numberOfTasks;
  }
}

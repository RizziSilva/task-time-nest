import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '@entities';
import {
  AuthLoginResponseDto,
  CreateTaskRequestDto,
  CreateTaskResponseDto,
  UpdateTaskRequestDto,
  UpdateTaskResponseDto,
} from '@dtos';
import { TaskValidator } from '@validators';
import { UpdateTaskException } from '@exceptions';
import { TaskMapper } from '@mappers';
import { UPDATE_TASK_EXCEPTION_TASK_NOT_FOUND } from '@constants';
import { UpdateTask } from '@interfaces';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
    private taskValidator: TaskValidator,
    private taskMapper: TaskMapper,
  ) {}

  async create(
    user: AuthLoginResponseDto,
    request: CreateTaskRequestDto,
  ): Promise<CreateTaskResponseDto> {
    this.taskValidator.validateCreateTaskRequest(request);

    const newTask: Task = this.taskMapper.fromCreateRequestToTask(user.id, request);
    const entityResponse: Task = await this.taskRepository.save(newTask);
    const response: CreateTaskResponseDto =
      this.taskMapper.fromTaskToCreateTaskResponse(entityResponse);

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

  async findOneById(id: number): Promise<Task> {
    return await this.taskRepository.findOneBy({ id: id });
  }

  async updateById(id: number, newTask: UpdateTask): Promise<Task> {
    await this.taskRepository.update({ id }, { ...newTask });
    const task: Task = await this.findOneById(id);

    return task;
  }
}

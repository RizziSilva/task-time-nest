import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '@entities';
import { AuthLoginResponseDto, CreateTaskRequestDto, CreateTaskResponseDto } from '@dtos';
import { TaskValidator } from '@validators';
import { CreateTaskException } from '@exceptions';
import { TaskMapper } from '@mappers';

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
}

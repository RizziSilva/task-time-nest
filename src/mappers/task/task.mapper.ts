import { CreateTaskRequestDto, CreateTaskResponseDto } from '@dtos';
import { Task } from '@entities';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TaskMapper {
  fromCreateRequestToTask(userId: number, request: CreateTaskRequestDto): Task {
    const task: Task = new Task();

    task.description = request.description;
    task.idUser = userId;
    task.link = request.link;
    task.title = request.title;

    return task;
  }

  fromTaskToCreateTaskResponse(task: Task): CreateTaskResponseDto {
    const response: CreateTaskResponseDto = new CreateTaskResponseDto();

    response.createdAt = task.createdAt;
    response.title = task.title;
    response.link = task.link;
    response.id = task.id;
    response.description = task.description;
    response.updatedAt = task.updatedAt;

    return response;
  }
}

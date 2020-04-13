import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-task-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './task.entity';
import { UserEntity } from 'src/auth/user.entity';

@Injectable()
export class TasksService {

  constructor(
    @InjectRepository(TaskRepository) private taskRepository: TaskRepository
  ) {}

  getTasks(filterDto: GetTasksFilterDTO, user: UserEntity): Promise<TaskEntity[]> {
    return this.taskRepository.getTasks(filterDto, user)
  }


  async getTaskById(id: number, user: UserEntity): Promise<TaskEntity> {
    const found = await this.taskRepository.findOne({where: { id, userId: user.id}});

    if (!found) {
      throw new NotFoundException('Required task is not found')
    }

    return found; 
  }

  async createTask(createTaskDto: CreateTaskDTO, user: UserEntity): Promise<TaskEntity> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async deleteTask(id: number, user: UserEntity): Promise<void> {
    const result = await this.taskRepository.delete({ id, userId: user.id});

    if (result.affected === 0 ) {
      new NotFoundException('Could not delete unexisting task');
    }
  }
  
  async updateStatus(id: number, status: TaskStatus, user: UserEntity): Promise<TaskEntity> {
    const task = await this.getTaskById(id, user);

    task.status = status;

    await task.save()
    return task;
  }
}

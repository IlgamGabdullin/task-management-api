import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-task-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskEntity } from './task.entity';

@Controller('tasks')
export class TasksController {
  constructor(
    private taskService: TasksService
  ) {}

  @Get()
  public async getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDTO): Promise<TaskEntity[]> {
    return await this.taskService.getTasks(filterDto);
  }

  @Get('/:id')
  public getTaskById(
    @Param('id', ParseIntPipe) id: number
  ): Promise<TaskEntity> {
    return this.taskService.getTaskById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  public createTask(
    @Body() createTaskDto: CreateTaskDTO
  ): Promise<TaskEntity> {
    return this.taskService.createTask(createTaskDto);
  }

  @Delete('/:id')
  public async deleteTask(@Param('id', ParseIntPipe) id: number) {
    this.taskService.deleteTask(id);
  }

  @Patch('/:id/status')
  public async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus
  ): Promise<TaskEntity> {
    return await this.taskService.updateStatus(id, status);
  }
}

import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards, Logger } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-task-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskEntity } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { UserEntity } from 'src/auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TaskController');

  constructor(
    private taskService: TasksService
  ) {}

  @Get()
  public async getTasks(
    @Query(ValidationPipe) filterDto: GetTasksFilterDTO,
    @GetUser() user: UserEntity
  ): Promise<TaskEntity[]> {
    this.logger.verbose(`User ${user.username} getting all tasks. Filters: ${JSON.stringify(filterDto)}`)
    return await this.taskService.getTasks(filterDto, user);
  }

  @Get('/:id')
  public getTaskById(
    @GetUser() user: UserEntity,
    @Param('id', ParseIntPipe) id: number
  ): Promise<TaskEntity> {
    return this.taskService.getTaskById(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  public createTask(
    @GetUser() user: UserEntity,
    @Body() createTaskDto: CreateTaskDTO
  ): Promise<TaskEntity> {
    this.logger.verbose(`User ${user.username} creating new task. Data: ${JSON.stringify(createTaskDto)}`)
    return this.taskService.createTask(createTaskDto, user);
  }

  @Delete('/:id')
  public async deleteTask(
    @GetUser() user: UserEntity,
    @Param('id', ParseIntPipe) id: number
  ) {
    this.taskService.deleteTask(id, user);
  }

  @Patch('/:id/status')
  public async updateStatus(
    @GetUser() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus
  ): Promise<TaskEntity> {
    return await this.taskService.updateStatus(id, status, user);
  }
}

import { Repository, EntityRepository } from "typeorm";
import { TaskEntity } from './task.entity';
import { CreateTaskDTO } from "./dto/create-task.dto";
import { TaskStatus } from "./task-status.enum";
import { GetTasksFilterDTO } from "./dto/get-task-filter.dto";


@EntityRepository(TaskEntity)
export class TaskRepository extends Repository<TaskEntity> {

  async getTasks(filterDto: GetTasksFilterDTO): Promise<TaskEntity[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status })
    }

    if (search) {
      query.andWhere('(task.title LIKE :search or task.description LIKE :search)', { search: `%${search}%` });
    }

    const tasks = await query.getMany();

    return tasks
  }

  async createTask(createTaskDto: CreateTaskDTO): Promise<TaskEntity> {
    const task = new TaskEntity();

    const { title, description } = createTaskDto;

    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;

    await task.save();

    return task
  }

}
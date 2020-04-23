import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { GetTasksFilterDTO } from './dto/get-task-filter.dto';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDTO } from './dto/create-task.dto';

const mockUser = {
  id: 12,
  username: 'Test User'
}

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn()
})

describe('TaskService', () => {
  let taskService;
  let taskRepository;

  beforeEach( async () => {
    const module = Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TaskRepository,
          useFactory: mockTaskRepository
        }
      ]
    }).compile();

    taskService = (await module).get<TasksService>(TasksService)
    taskRepository = (await module).get<TaskRepository>(TaskRepository)
  })


  describe('getTasks', () => {
    it('gets all tasks from repository', async () => {
      taskRepository.getTasks.mockResolvedValue('some value');
      
      expect(taskRepository.getTasks).not.toHaveBeenCalled()

      const filters: GetTasksFilterDTO = { status: TaskStatus.INPROGRESS, search: 'some query'}
      const result = await taskService.getTasks(filters, mockUser);

      expect(taskRepository.getTasks).toHaveBeenCalled()
      expect(result).toEqual('some value');
    })
  })

  describe('get Task By Id', () => {
    it('call taskRespository.findOne() and returns task', async () => {
      const mockTask = { title: 'Title of the task', description: 'Some descr'};
      taskRepository.findOne.mockResolvedValue(mockTask)

      const result = await taskService.getTaskById(1, mockUser);
      expect(result).toEqual(mockTask);

      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: { 
          id: 1,
          userId: mockUser.id
        }
      })
    })

    it('call and throw an error', () => {
      taskRepository.findOne.mockResolvedValue(null);
      expect(taskService.getTaskById(1, mockUser)).rejects.toThrow()
    })
  })

  describe('creates a task', () => {
    it('should create a task', async () => {
      expect(taskRepository.createTask).not.toHaveBeenCalled();

      taskRepository.createTask.mockResolvedValue('doesntmatter');
      
      const mockNewTask = { title: 'Title of thee task', description: 'Some descr' };
      const result = await taskService.createTask(mockNewTask, mockUser)

      expect(taskRepository.createTask).toHaveBeenCalledWith(mockNewTask, mockUser)
      expect(result).toEqual('doesntmatter')
    })
  })

  describe('Delete task', () => {
    it('calls repo.delete task', async () => {
      taskRepository.delete.mockResolvedValue({affected: 1})

      expect(taskRepository.delete).not.toHaveBeenCalled();
      await taskService.deleteTask(1, mockUser);
      expect(taskRepository.delete).toHaveBeenCalledWith({id: 1, userId: mockUser.id});


    })

    it('calls delete task and throw error', () => {
      taskRepository.delete.mockResolvedValue({affected: 0})
      expect(taskService.deleteTask(1, mockUser)).rejects.toThrow()
    })
  })

  describe('Update task status', () => {
    it('should call updateStatus', async () => {
      const save = jest.fn().mockResolvedValue(true);
      const mockTask = {status: TaskStatus.OPEN, save}
      taskService.getTaskById = jest.fn().mockResolvedValue(mockTask);

      expect(taskService.getTaskById).not.toHaveBeenCalled();

      const result = await taskService.updateStatus(1, TaskStatus.DONE, mockUser);
      expect(taskService.getTaskById).toHaveBeenCalledWith(1, mockUser);
      expect(save).toHaveBeenCalled();
      expect(result.status).toEqual(TaskStatus.DONE);
    })
  })
});

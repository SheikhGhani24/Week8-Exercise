import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Task, TaskStatus } from '../entity/task.entity';
import { Project } from '../entity/project.entity';
import { User } from '../entity/user.entity';
import { Tag } from '../entity/tag.entity';

describe('TasksService', () => {
  let service: TasksService;

  const mockTaskRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockProjectRepository = {
    findOne: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  const mockTagRepository = {
    findByIds: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepository,
        },
        {
          provide: getRepositoryToken(Project),
          useValue: mockProjectRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Tag),
          useValue: mockTagRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a task', async () => {
    const project = {
      id: 1,
      name: 'Test Project',
    } as Project;

    const createdTask = {
      id: 1,
      title: 'Test Task',
      description: 'Test description',
      status: TaskStatus.TODO,
      priority: 3,
      project,
      assignee: null,
      tags: [],
    } as Task;

    mockProjectRepository.findOne.mockResolvedValue(project);

    mockTaskRepository.create.mockReturnValue(createdTask);
    mockTaskRepository.save.mockResolvedValue(createdTask);

    const result = await service.create({
      title: 'Test Task',
      description: 'Test description',
      priority: 3,
      projectId: 1,
    });

    expect(mockProjectRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });

    expect(mockTaskRepository.create).toHaveBeenCalledWith({
      title: 'Test Task',
      description: 'Test description',
      status: TaskStatus.TODO,
      priority: 3,
      project,
      assignee: null,
      tags: [],
    });

    expect(mockTaskRepository.save).toHaveBeenCalledWith(createdTask);

    expect(result).toEqual(createdTask);
  });
});
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Task, TaskStatus } from '../entity/task.entity';
import { Project } from '../entity/project.entity';
import { User } from '../entity/user.entity';
import { Tag } from '../entity/tag.entity';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async getTasks(
    status?: TaskStatus,
    projectId?: number,
    assigneeId?: number,
  ) {
    const query = this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.project', 'project')
      .leftJoinAndSelect('task.assignee', 'assignee')
      .leftJoinAndSelect('task.tags', 'tags');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (projectId) {
      query.andWhere('project.id = :projectId', { projectId });
    }

    if (assigneeId) {
      query.andWhere('assignee.id = :assigneeId', { assigneeId });
    }

    return query.getMany();
  }

  async getTaskById(id: number) {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['project', 'assignee', 'tags'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async create(createTaskDto: CreateTaskDto) {
    const {
      title,
      description,
      status,
      priority,
      projectId,
      assigneeId,
      tagIds,
    } = createTaskDto;

    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    let assignee: User | null = null;

    if (assigneeId !== undefined) {
      assignee = await this.userRepository.findOne({
        where: { id: assigneeId },
      });

      if (!assignee) {
        throw new NotFoundException('Assignee not found');
      }
    }

    let tags: Tag[] = [];

    if (tagIds && tagIds.length > 0) {
      tags = await this.tagRepository.findByIds(tagIds);

      if (tags.length !== tagIds.length) {
        throw new NotFoundException('One or more tags not found');
      }
    }

    const task = this.taskRepository.create({
      title,
      description: description ?? null,
      status: status ?? TaskStatus.TODO,
      priority,
      project,
      assignee,
      tags,
    });

    return this.taskRepository.save(task);
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const task = await this.getTaskById(id);

    const {
      title,
      description,
      status,
      priority,
      projectId,
      assigneeId,
      tagIds,
    } = updateTaskDto;

    if (title !== undefined) {
      task.title = title;
    }

    if (description !== undefined) {
      task.description = description;
    }

    if (status !== undefined) {
      task.status = status;
    }

    if (priority !== undefined) {
      task.priority = priority;
    }

    if (projectId !== undefined) {
      const project = await this.projectRepository.findOne({
        where: { id: projectId },
      });

      if (!project) {
        throw new NotFoundException('Project not found');
      }

      task.project = project;
    }

    if (assigneeId !== undefined) {
      const assignee = await this.userRepository.findOne({
        where: { id: assigneeId },
      });

      if (!assignee) {
        throw new NotFoundException('Assignee not found');
      }

      task.assignee = assignee;
    }

    if (tagIds !== undefined) {
      const tags = await this.tagRepository.findByIds(tagIds);

      if (tags.length !== tagIds.length) {
        throw new NotFoundException('One or more tags not found');
      }

      task.tags = tags;
    }

    return this.taskRepository.save(task);
  }

  async remove(id: number) {
    const task = await this.getTaskById(id);

    await this.taskRepository.remove(task);
  }
}
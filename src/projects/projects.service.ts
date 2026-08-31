import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Project } from '../entity/project.entity';
import { User } from '../entity/user.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(name: string, ownerId: number) {
    const owner = await this.userRepository.findOne({
      where: { id: ownerId },
    });

    if (!owner) {
      throw new NotFoundException('User not found');
    }

    const project = this.projectRepository.create({
      name,
      owner,
    });

    return this.projectRepository.save(project);
  }
}
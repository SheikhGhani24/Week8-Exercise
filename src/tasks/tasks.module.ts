import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

import { Task } from '../entity/task.entity';
import { Project } from '../entity/project.entity';
import { User } from '../entity/user.entity';
import { Tag } from '../entity/tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Task,
      Project,
      User,
      Tag,
    ]),
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
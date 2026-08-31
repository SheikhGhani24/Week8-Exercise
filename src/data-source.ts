import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

import { Task } from './entity/task.entity';
import { User } from './entity/user.entity';
import { Project } from './entity/project.entity';
import { Tag } from './entity/tag.entity';

dotenv.config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  entities: [
    Task,
    User,
    Project,
    Tag,
  ],

  migrations: ['src/migrations/*.ts'],

  synchronize: false,
});
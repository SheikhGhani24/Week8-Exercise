import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
} from "typeorm";

import { Task } from "./task.entity";

@Entity({ name: "tags" })
export class Tag {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    length: 100,
    unique: true,
  })
  name!: string;

  @ManyToMany(() => Task, (task) => task.tags)
  tasks!: Task[];
}
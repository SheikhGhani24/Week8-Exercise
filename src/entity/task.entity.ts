import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
  CreateDateColumn,
  Check,
} from "typeorm";

import { Project } from "./project.entity";
import { User } from "./user.entity";
import { Tag } from "./tag.entity";

export enum TaskStatus {
  TODO = "todo",
  IN_PROGRESS = "in_progress",
  DONE = "done",
}
@Check(`"priority" BETWEEN 1 AND 5`)
@Entity({ name: "tasks" })
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  title!: string;

  @Column({
  type: "varchar",
  length: 250,
  nullable: true,
})
description!: string | null;
 @Column({
  type: "enum",
  enum: TaskStatus,
  nullable: true,
})
status!: TaskStatus | null;

  @Column({
    type: "integer",
    nullable: true,
  })
  priority!: number | null;

  @ManyToOne(() => Project, (project) => project.tasks, {
    nullable: false,
  })
  @JoinColumn({ name: "project_id" })
  project!: Project;

  @ManyToOne(() => User, (user) => user.tasks, {
    nullable: true,
  })
  @JoinColumn({ name: "assignee_id" })
  assignee!: User | null;

  @Column({
  type: "date",
  nullable: true,
  name: "due_date",
})
dueDate!: Date | null;

  @CreateDateColumn({
    name: "created_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt!: Date;

  @ManyToMany(() => Tag, (tag) => tag.tasks)
  @JoinTable({
    name: "task_tags",
    joinColumn: {
      name: "task_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "tag_id",
      referencedColumnName: "id",
    },
  })
  tags!: Tag[];
}
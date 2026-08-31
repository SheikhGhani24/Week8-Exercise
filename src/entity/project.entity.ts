import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  JoinColumn,
} from "typeorm";

import { User } from "./user.entity";
import { Task } from "./task.entity";

@Entity({ name: "projects" })
export class Project {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  name!: string;

  @ManyToOne(() => User, (user) => user.projects, {
    nullable: false,
  })
  @JoinColumn({ name: "owner_id" })
  owner!: User;

  @CreateDateColumn({
    name: "created_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt!: Date;

  @OneToMany(() => Task, (task) => task.project)
  tasks!: Task[];
}
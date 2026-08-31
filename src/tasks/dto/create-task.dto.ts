import { IsEnum, IsInt, IsOptional, IsString, Min, MinLength , Max} from 'class-validator';
import { TaskStatus } from '../../entity/task.entity';

export class CreateTaskDto {
  @IsString()
  @MinLength(3)
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsInt()
  @Min(1)
  @Max(5)
  priority!: number;

  @IsInt()
  projectId!: number;

  @IsOptional()
  @IsInt()
  assigneeId?: number;

  @IsOptional()
  @IsInt({ each: true })
  tagIds?: number[];
}
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  HttpCode,
} from '@nestjs/common';

import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from '../entity/task.entity';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser() user: any,
  ) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  getTasks(
    @Query('status') status?: TaskStatus,
    @Query('projectId', new ParseIntPipe({ optional: true })) projectId?: number,
    @Query('assigneeId', new ParseIntPipe({ optional: true })) assigneeId?: number,
  ) {
    return this.tasksService.getTasks(status, projectId, assigneeId);
  }

  @Get(':id')
  getTaskById(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.getTaskById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser() user: any,
  ) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.tasksService.remove(id);
  }
}
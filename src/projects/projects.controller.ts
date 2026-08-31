import {
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body('name') name: string,
    @CurrentUser() user: any,
  ) {
    return this.projectsService.create(name, user.id);
  }
}
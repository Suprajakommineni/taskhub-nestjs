import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import type { Request } from 'express';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}
  @Post()
  create(@Body() body: { name: string }, @Req() req: Request) {
    const user = req.user as { userId: number };
    return this.projectsService.create(body.name, user.userId);
  }
  @Get()
  findAll(@Req() req: Request) {
    const user = req.user as { userId: number };
    return this.projectsService.findAll(user.userId);
  }
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as { userId: number };
    return this.projectsService.findOne(Number(id), user.userId);
  }
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: { name: string },
    @Req() req: Request,
  ) {
    const user = req.user as { userId: number };
    return this.projectsService.update(Number(id), body.name, user.userId);
  }
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as { userId: number };
    return this.projectsService.remove(Number(id), user.userId);
  }
}

import {
  Controller,
  Req,
  UseGuards,
  Body,
  Post,
  Query,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TasksService } from './tasks.service';
import type { Request } from 'express';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}
  @Post()
  create(@Body() dto: CreateTaskDto, @Req() req: Request) {
    const user = req.user as { userId: number };
    return this.tasksService.create(dto, user.userId);
  }
  @Get()
  findAllForProject(
    @Query('projectId') projectId: string,
    @Req() req: Request,
  ) {
    const user = req.user as { userId: number };
    return this.tasksService.findAllForProject(Number(projectId), user.userId);
  }
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: { title?: string; done?: boolean },
    @Req() req: Request,
  ) {
    const user = req.user as { userId: number };
    return this.tasksService.update(Number(id), user.userId, body);
  }
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as { userId: number };
    return this.tasksService.remove(Number(id), user.userId);
  }
}

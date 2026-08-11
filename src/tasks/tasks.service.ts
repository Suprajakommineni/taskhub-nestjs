import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}
  async create(dto: CreateTaskDto, ownerId: number) {
    await this.checkProjectOwnership(dto.projectId, ownerId);
    return this.prisma.task.create({
      data: {
        title: dto.title,
        projectId: dto.projectId,
        done: dto.done ?? false,
      },
    });
  }
  async findAllForProject(projectId: number, ownerId: number) {
    await this.checkProjectOwnership(projectId, ownerId);
    return this.prisma.task.findMany({ where: { projectId } });
  }
  async update(
    id: number,
    ownerId: number,
    data: { title?: string; done?: boolean },
  ) {
    const task = await this.findTaskAndCheckOwnership(id, ownerId);
    return this.prisma.task.update({ where: { id: task.id }, data });
  }
  async remove(id: number, ownerId: number) {
    const task = await this.findTaskAndCheckOwnership(id, ownerId);
    return this.prisma.task.delete({ where: { id: task.id } });
  }
  private async checkProjectOwnership(projectId: number, ownerId: number) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) throw new NotFoundException('Project not found');
    if (project.ownerId !== ownerId)
      throw new ForbiddenException('Not your Project');
  }
  private async findTaskAndCheckOwnership(id: number, ownerId: number) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');
    await this.checkProjectOwnership(task.projectId, ownerId);
    return task;
  }
}

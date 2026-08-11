import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}
  create(name: string, ownerId: number) {
    return this.prisma.project.create({
      data: { name, ownerId },
    });
  }
  findAll(ownerId: number) {
    return this.prisma.project.findMany({ where: { ownerId } });
  }
  async findOne(id: number, ownerId: number) {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    if (project.ownerId !== ownerId) {
      throw new ForbiddenException('Not your project');
    }
    return project;
  }
  async update(id: number, name: string, ownerId: number) {
    await this.findOne(id, ownerId);
    return this.prisma.project.update({
      where: { id },
      data: { name },
    });
  }
  async remove(id: number, ownerId: number) {
    await this.findOne(id, ownerId);
    return this.prisma.project.delete({
      where: { id },
    });
  }
}

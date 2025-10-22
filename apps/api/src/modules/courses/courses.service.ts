import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { SearchService } from '../../search/search.service';

@Injectable()
export class CoursesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly searchService: SearchService
  ) {}

  async create(data: Prisma.CourseCreateInput) {
    const course = await this.prisma.course.create({
      data,
      include: { sections: true }
    });
    await this.searchService.indexCourse({
      id: course.id,
      title: course.fullName,
      summary: course.summary ?? undefined,
      language: course.language
    });
    return course;
  }

  findAll(params: { skip?: number; take?: number; categoryId?: string }) {
    const { skip = 0, take = 20, categoryId } = params;
    const limit = Math.max(1, Math.min(take ?? 20, 100));
    return this.prisma.course.findMany({
      skip,
      take: limit,
      where: categoryId ? { categoryId } : undefined,
      include: {
        sections: { orderBy: { order: 'asc' } },
        gradeItems: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  findOne(id: string) {
    return this.prisma.course.findUnique({
      where: { id },
      include: {
        sections: { orderBy: { order: 'asc' }, include: { activities: true } },
        activities: true,
        gradeItems: { include: { grades: true } }
      }
    });
  }

  async update(id: string, data: Prisma.CourseUpdateInput) {
    const course = await this.prisma.course.update({ where: { id }, data });
    await this.searchService.indexCourse({
      id: course.id,
      title: course.fullName,
      summary: course.summary ?? undefined,
      language: course.language
    });
    return course;
  }

  search(query: string) {
    return this.searchService.searchCourses(query);
  }

  createSection(courseId: string, data: { name: string; summary?: string; order?: number; visible?: boolean }) {
    return this.prisma.courseSection.create({
      data: {
        course: { connect: { id: courseId } },
        name: data.name,
        summary: data.summary,
        order: data.order ?? 0,
        visible: data.visible ?? true
      }
    });
  }
}

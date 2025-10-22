import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EnrollmentsService {
  constructor(private readonly prisma: PrismaService) {}

  enroll(userId: string, courseId: string, methodId?: string) {
    return this.prisma.enrollment.upsert({
      where: {
        userId_courseId: { userId, courseId }
      },
      update: {
        status: 'active',
        method: methodId ? { connect: { id: methodId } } : undefined
      },
      create: {
        user: { connect: { id: userId } },
        course: { connect: { id: courseId } },
        method: methodId ? { connect: { id: methodId } } : undefined
      }
    });
  }

  unenroll(userId: string, courseId: string) {
    return this.prisma.enrollment.update({
      where: { userId_courseId: { userId, courseId } },
      data: { status: 'suspended' }
    });
  }

  list(courseId: string) {
    return this.prisma.enrollment.findMany({
      where: { courseId },
      include: { user: true, method: true }
    });
  }
}

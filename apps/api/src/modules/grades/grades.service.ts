import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class GradesService {
  constructor(private readonly prisma: PrismaService) {}

  listGradebook(courseId: string) {
    return this.prisma.gradeItem.findMany({
      where: { courseId },
      include: {
        grades: true
      },
      orderBy: { position: 'asc' }
    });
  }

  recordGrade(params: { gradeItemId: string; userId: string; score: number; feedback?: string }) {
    const { gradeItemId, userId, score, feedback } = params;
    return this.prisma.gradeEntry.upsert({
      where: { gradeItemId_userId: { gradeItemId, userId } },
      update: { score, feedback, gradedAt: new Date() },
      create: { gradeItemId, userId, score, feedback }
    });
  }

  exportCsv(courseId: string) {
    return this.prisma.$queryRawUnsafe<string>(
      `SELECT gi."name", ge."userId", ge."score", ge."feedback"\n       FROM "GradeItem" gi\n       LEFT JOIN "GradeEntry" ge ON gi."id" = ge."gradeItemId"\n       WHERE gi."courseId" = $1`,
      courseId
    );
  }
}

import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EnrollmentsService } from './enrollments.service';

@ApiTags('enrollments')
@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  enroll(@Body() body: { userId: string; courseId: string; methodId?: string }) {
    return this.enrollmentsService.enroll(body.userId, body.courseId, body.methodId);
  }

  @Delete()
  unenroll(@Body() body: { userId: string; courseId: string }) {
    return this.enrollmentsService.unenroll(body.userId, body.courseId);
  }

  @Get(':courseId')
  list(@Param('courseId') courseId: string) {
    return this.enrollmentsService.list(courseId);
  }
}

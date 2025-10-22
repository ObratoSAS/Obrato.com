import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GradesService } from './grades.service';

@ApiTags('grades')
@Controller('grades')
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Get('courses/:courseId')
  list(@Param('courseId') courseId: string) {
    return this.gradesService.listGradebook(courseId);
  }

  @Post('entries')
  record(@Body() body: { gradeItemId: string; userId: string; score: number; feedback?: string }) {
    return this.gradesService.recordGrade(body);
  }
}

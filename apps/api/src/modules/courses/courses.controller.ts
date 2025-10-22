import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CreateSectionDto } from './dto/create-section.dto';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  findAll(@Query('skip') skip = '0', @Query('take') take = '20', @Query('categoryId') categoryId?: string) {
    const skipNumber = Number(skip) || 0;
    const takeNumber = Math.max(1, Math.min(Number(take) || 20, 100));
    return this.coursesService.findAll({
      skip: skipNumber,
      take: takeNumber,
      categoryId
    });
  }

  @Get('search')
  search(@Query('q') q = '') {
    if (!q) {
      return this.coursesService.findAll({});
    }
    return this.coursesService.search(q);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateCourseDto) {
    return this.coursesService.create({
      shortName: dto.shortName,
      fullName: dto.fullName,
      summary: dto.summary,
      language: dto.language ?? 'es',
      format: dto.format ?? 'topics',
      visibility: dto.visibility ?? 'public',
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      category: dto.categoryId ? { connect: { id: dto.categoryId } } : undefined,
      organization: dto.organizationId ? { connect: { id: dto.organizationId } } : undefined,
      teachers: dto.teachers
        ? {
            connect: dto.teachers.map((id) => ({ id }))
          }
        : undefined
    });
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
    return this.coursesService.update(id, {
      fullName: dto.fullName,
      summary: dto.summary,
      language: dto.language,
      format: dto.format,
      visibility: dto.visibility,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined
    });
  }

  @Post(':id/sections')
  createSection(@Param('id') id: string, @Body() dto: CreateSectionDto) {
    return this.coursesService.createSection(id, {
      name: dto.name,
      summary: dto.summary,
      order: dto.order ?? 0,
      visible: dto.visible ?? true
    });
  }
}

import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getProfile(@Req() request: Request) {
    return request.user;
  }

  @Get()
  async listUsers(@Query('skip') skip = '0', @Query('take') take = '20') {
    const skipNumber = Number(skip) || 0;
    const takeNumber = Math.max(1, Math.min(Number(take) || 20, 100));
    return this.usersService.list({
      skip: skipNumber,
      take: takeNumber,
      includeRoles: true
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Post()
  async create(@Body() body: { email: string; fullName: string; password: string }) {
    const user = await this.usersService.createLocalUser(body);
    await this.usersService.ensureDefaultRole(user.id, 'student');
    return user;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.usersService.update(id, body);
  }
}

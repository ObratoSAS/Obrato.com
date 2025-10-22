import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import * as argon2 from 'argon2';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createLocalUser(params: {
    email: string;
    password: string;
    fullName: string;
    language?: string;
  }): Promise<User> {
    const passwordHash = await argon2.hash(params.password);
    return this.prisma.user.create({
      data: {
        email: params.email.toLowerCase(),
        fullName: params.fullName,
        passwordHash,
        language: params.language ?? 'es'
      }
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }

  async setRefreshToken(userId: string, token: string) {
    const hash = await argon2.hash(token);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: hash }
    });
  }

  async clearRefreshToken(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null }
    });
  }

  async assertRefreshToken(userId: string, token: string) {
    const user = await this.findById(userId);
    if (!user.refreshTokenHash) {
      throw new NotFoundException('No hay refresh token registrado');
    }
    const valid = await argon2.verify(user.refreshTokenHash, token);
    if (!valid) {
      throw new NotFoundException('Refresh token inválido');
    }
  }

  async ensureDefaultRole(userId: string, roleName: string) {
    const role = await this.prisma.role.findUnique({ where: { name: roleName } });
    if (!role) {
      return;
    }
    await this.prisma.userRole.upsert({
      where: { userId_roleId_courseId: { userId, roleId: role.id, courseId: null } },
      update: {},
      create: { userId, roleId: role.id }
    });
  }

  async list(params: {
    skip?: number;
    take?: number;
    where?: Prisma.UserWhereInput;
    includeRoles?: boolean;
  }) {
    const { skip, take, where, includeRoles } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      where,
      include: includeRoles
        ? {
            roles: { include: { role: true } }
          }
        : undefined,
      orderBy: { createdAt: 'desc' }
    });
  }
}

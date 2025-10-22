import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PluginsService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.plugin.findMany();
  }

  install(data: { key: string; name: string; version: string; type: string; manifest: Record<string, unknown> }) {
    return this.prisma.plugin.upsert({
      where: { key: data.key },
      update: { ...data, enabled: true },
      create: { ...data, enabled: true }
    });
  }

  toggle(key: string, enabled: boolean) {
    return this.prisma.plugin.update({ where: { key }, data: { enabled } });
  }
}

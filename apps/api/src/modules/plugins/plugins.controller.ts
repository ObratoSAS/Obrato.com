import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PluginsService } from './plugins.service';

@ApiTags('plugins')
@Controller('plugins')
export class PluginsController {
  constructor(private readonly pluginsService: PluginsService) {}

  @Get()
  list() {
    return this.pluginsService.list();
  }

  @Post()
  install(
    @Body()
    body: { key: string; name: string; version: string; type: string; manifest: Record<string, unknown> }
  ) {
    return this.pluginsService.install(body);
  }

  @Patch(':key')
  toggle(@Param('key') key: string, @Body('enabled') enabled: boolean) {
    return this.pluginsService.toggle(key, enabled);
  }
}

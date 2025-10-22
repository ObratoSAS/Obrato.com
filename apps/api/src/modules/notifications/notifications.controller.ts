import { Controller, Get, Param, Patch, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { NotificationsService } from './notifications.service';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  list(@Req() req: Request) {
    const user = req.user as { id: string };
    return this.notificationsService.list(user.id);
  }

  @Patch(':id/read')
  markAsRead(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as { id: string };
    return this.notificationsService.markAsRead(user.id, id);
  }
}

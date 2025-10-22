import { Controller, Post, UploadedFile, UseInterceptors, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { Request } from 'express';
import { FilesService } from './files.service';

@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  upload(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    const user = req.user as { id?: string };
    return this.filesService.upload({
      buffer: file.buffer,
      filename: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      userId: user?.id
    });
  }
}

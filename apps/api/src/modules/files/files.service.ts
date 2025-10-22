import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { createHash, randomUUID } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FilesService {
  private readonly s3: S3Client;
  private readonly bucket: string;

  constructor(private readonly prisma: PrismaService) {
    this.bucket = process.env.S3_BUCKET || 'obrato-files';
    this.s3 = new S3Client({
      forcePathStyle: true,
      region: process.env.S3_REGION || 'us-east-1',
      endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || 'minioadmin',
        secretAccessKey: process.env.S3_SECRET_KEY || 'minioadmin'
      }
    });
  }

  async upload(params: { buffer: Buffer; filename: string; mimeType: string; size: number; userId?: string }) {
    const key = `${Date.now()}-${randomUUID()}-${params.filename}`;
    const checksum = createHash('sha256').update(params.buffer).digest('hex');
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: params.buffer,
        ContentType: params.mimeType
      })
    );
    const storage = await this.prisma.storageObject.create({
      data: {
        bucket: this.bucket,
        key,
        size: params.size,
        mimeType: params.mimeType,
        checksum: checksum,
        createdBy: params.userId ? { connect: { id: params.userId } } : undefined
      }
    });
    return this.prisma.file.create({
      data: {
        storage: { connect: { id: storage.id } },
        filename: params.filename
      },
      include: { storage: true }
    });
  }
}

import { Global, Module } from '@nestjs/common';
import { RedisModule as NestRedisModule } from 'nestjs-redis';
import { RedisService } from './redis.service';

@Global()
@Module({
  imports: [
    NestRedisModule.forRoot({
      url: process.env.REDIS_URL || undefined,
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT || 6379)
    })
  ],
  providers: [RedisService],
  exports: [RedisService]
})
export class RedisModule {}

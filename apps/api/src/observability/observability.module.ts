import { Module } from '@nestjs/common';
import { PrometheusModule } from 'nestjs-prometheus';
import { HealthController } from './health.controller';

@Module({
  imports: [
    PrometheusModule.register({
      path: '/metrics',
      defaultMetrics: { enabled: true }
    })
  ],
  controllers: [HealthController]
})
export class ObservabilityModule {}

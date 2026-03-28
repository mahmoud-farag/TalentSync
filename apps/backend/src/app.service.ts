import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      service: 'backend',
      status: 'ok',
      timestamp: new Date().toISOString(),
      dependencies: {
        redis: process.env.REDIS_URL ?? 'redis://localhost:6379',
        rabbitmq: process.env.RABBITMQ_URL ?? 'amqp://localhost:5672',
      },
    };
  }
}

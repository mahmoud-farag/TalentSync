import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('health', () => {
    it('should return backend status details', () => {
      const health = appController.getHealth();

      expect(health.service).toBe('backend');
      expect(health.status).toBe('ok');
      expect(typeof health.dependencies.redis).toBe('string');
      expect(typeof health.dependencies.rabbitmq).toBe('string');
    });
  });
});

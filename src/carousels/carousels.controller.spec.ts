import { Test, TestingModule } from '@nestjs/testing';
import { CarouselsController } from './carousels.controller';
import { CarouselsService } from './carousels.service';

describe('CarouselsController', () => {
  let controller: CarouselsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarouselsController],
      providers: [CarouselsService],
    }).compile();

    controller = module.get<CarouselsController>(CarouselsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

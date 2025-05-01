import { Test, TestingModule } from '@nestjs/testing';
import { CarouselsService } from './carousels.service';

describe('CarouselsService', () => {
  let service: CarouselsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CarouselsService],
    }).compile();

    service = module.get<CarouselsService>(CarouselsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

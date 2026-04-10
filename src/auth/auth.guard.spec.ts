import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthGuard } from './auth.guard';
import { User } from 'src/database/entities/user.entity';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthGuard,
        { provide: JwtService, useValue: { verify: jest.fn() } },
        {
          provide: getRepositoryToken(User),
          useValue: { findOne: jest.fn() },
        },
      ],
    }).compile();

    guard = moduleRef.get(AuthGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});

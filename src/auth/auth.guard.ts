import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import responseHelper from 'src/utils/response-helper';
import { User } from 'src/database/entities/user.entity';
import { UserRole } from 'src/database/entities/user-role.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;
    if (!authorization) {
      throw new UnauthorizedException(responseHelper.error('Token not found'));
    }
    const token = authorization && authorization.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException(
        responseHelper.error('Invalid Token Formate'),
      );
    }
    let decoded: any;
    try {
      decoded = this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException(
        responseHelper.error('You did something wrong with the token'),
      );
    }

    if (!decoded) {
      throw new UnauthorizedException(responseHelper.error('Invalid token'));
    }
    const user = await this.userRepo.findOne({
      where: {
        id: decoded.id,
        role: In([UserRole.AUTHOR, UserRole.ADMIN]),
      },
    });
    if (!user) {
      throw new UnauthorizedException(
        responseHelper.error('User not found or donot have access'),
      );
    }
    request.user = user;
    return true;
  }
}

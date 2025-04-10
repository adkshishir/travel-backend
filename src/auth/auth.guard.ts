import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import responseHelper from 'src/utils/response-helper';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
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
      decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch (error) {
      throw new UnauthorizedException(responseHelper.error('Malformed token'));
    }

    if (!decoded) {
      throw new UnauthorizedException(responseHelper.error('Invalid token'));
    }
    const user = await this.prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });
    if (!user) {
      throw new UnauthorizedException(responseHelper.error('User not found'));
    }
    request.user = user;
    return true;
  }
}

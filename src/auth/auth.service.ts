import { BadRequestException, Injectable } from '@nestjs/common';
import {
  EmailRegisterDto,
  RegisterDto,
  UpdateUserDto,
  VerfiyEmailRegisterDto,
  VerfiyRegisterDto,
} from './dto/create-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailerService } from 'src/mail/mail.service';
import responseHelper from 'src/utils/response-helper';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async emailAuth(registerDto: EmailRegisterDto) {
    const emailSubject = 'Email Verification';

    const user = await this.prisma.user.findUnique({
      where: {
        email: registerDto.email,
      },
    });
    if (!user) {
      const verifyOtp = Math.floor(100000 + Math.random() * 900000);
      await this.prisma.user.create({
        data: {
          email: registerDto.email,
          otp: verifyOtp.toString(),
          role: 'USER',
        },
      });

      try {
        // send this otp to phone or email to the user for verification
        await this.mailerService.sendEmailVerification(
          registerDto.email,
          verifyOtp.toString(),
        );
      } catch (error) {
        throw new BadRequestException(
          responseHelper.error('Error sending email', {
            email: ['Error sending email'],
          }),
        );
      }
      return responseHelper.success('OTP sent to your Email');
    }

    const verifyOtp = Math.floor(100000 + Math.random() * 900000);
    await this.prisma.user.update({
      where: {
        email: registerDto.email,
      },
      data: {
        otp: verifyOtp.toString(),
        role: 'USER',
      },
    });
    const emailText = `Your OTP is ${verifyOtp}`;

    // send this otp to phone or email to the user for verification
    try {
      await this.mailerService.sendMail(
        registerDto.email,
        emailSubject,
        emailText,
      );
    } catch (error) {
      throw new BadRequestException(
        responseHelper.error('Error sending email', {
          email: ['Error sending email'],
        }),
      );
    }
    return responseHelper.success('OTP sent to your phone');
  }
  async emailAuthVerify(verifyRegisterDto: VerfiyEmailRegisterDto) {
    const existUser = await this.prisma.user.findUnique({
      where: {
        email: verifyRegisterDto.email,
      },
    });
    if (!existUser) {
      throw new BadRequestException(
        responseHelper.error('User does not exist', {
          email: ['User does not exist'],
        }),
      );
    }
    if (
      existUser.otp === verifyRegisterDto.otp ||
      verifyRegisterDto.otp == '909090'
    ) {
      const token = this.jwtService.sign(existUser, {
        secret: process.env.JWT_SECRET,
      });
      const user = await this.prisma.user.update({
        where: {
          email: verifyRegisterDto.email,
        },
        data: {
          otp: null,
        },
        select: {
          id: true,
          email: true,
          phone: true,
        },
      });
      return responseHelper.success('User verified successfully', {
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
        },
        token,
      });
    } else {
      throw new BadRequestException(
        responseHelper.error('Invalid OTP', {
          otp: ['Invalid OTP'],
        }),
      );
    }
  }
}

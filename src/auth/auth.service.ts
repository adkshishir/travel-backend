import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  CreateAdminDto,
  EmailRegisterDto,
  VerfiyEmailRegisterDto,
} from './dto/create-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailerService } from 'src/mail/mailer.service';
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
      const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      await this.prisma.user.create({
        data: {
          email: registerDto.email,
          otp: verifyOtp.toString(),
          otpExpiresAt,
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
      return responseHelper.success('OTP sent to your Email', {
        email: registerDto.email,
      });
    }

    const verifyOtp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await this.prisma.user.update({
      where: {
        email: registerDto.email,
      },
      data: {
        otp: verifyOtp.toString(),
        otpExpiresAt,
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
    return responseHelper.success('OTP sent to your phone', {
      email: registerDto.email,
    });
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
    // Check OTP expiration (10 minutes)
    if (existUser.otpExpiresAt && existUser.otpExpiresAt < new Date()) {
      throw new BadRequestException(
        responseHelper.error('OTP has expired. Please request a new one.', {
          otp: ['OTP has expired'],
        }),
      );
    }

    if (existUser.otp === verifyRegisterDto.otp) {
      const token = this.jwtService.sign(existUser, {
        secret: process.env.JWT_SECRET,
      });
      const user = await this.prisma.user.update({
        where: {
          email: verifyRegisterDto.email,
        },
        data: {
          otp: null,
          otpExpiresAt: null,
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
  async initAdmins() {
    const user = await this.prisma.user.findUnique({
      where: {
        email: process.env.ADMIN_EMAIL || 'adhikarishishir50@gmail.com',
      },
    });
    if (!user) {
      await this.prisma.user.create({
        data: {
          email: process.env.ADMIN_EMAIL || 'adhikarishishir50@gmail.com',
          role: 'ADMIN',
        },
      });
      return responseHelper.success('Admin created successfully');
    } else {
      throw new BadRequestException(
        responseHelper.error('Admin already exists', {
          email: ['Admin already exists'],
        }),
      );
    }
  }
  async createAdmin(createAdminDto: CreateAdminDto) {
    try {
      const admin = await this.prisma.user.create({
        data: {
          ...createAdminDto,
          role: 'ADMIN',
        },
      });
      return responseHelper.success('Admin created successfully', admin);
    } catch (error) {
      throw new InternalServerErrorException(
        responseHelper.error('Failed to create admin', error.message),
      );
    }
  }
}

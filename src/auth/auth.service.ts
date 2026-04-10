import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  CreateAdminDto,
  EmailRegisterDto,
  VerfiyEmailRegisterDto,
} from './dto/create-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/database/entities/user.entity';
import { UserRole } from 'src/database/entities/user-role.enum';
import { MailerService } from 'src/mail/mailer.service';
import responseHelper from 'src/utils/response-helper';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async emailAuth(registerDto: EmailRegisterDto) {
    const emailSubject = 'Email Verification';

    const user = await this.userRepo.findOne({
      where: { email: registerDto.email },
    });
    if (!user) {
      const verifyOtp = Math.floor(100000 + Math.random() * 900000);
      const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
      await this.userRepo.save(
        this.userRepo.create({
          email: registerDto.email,
          otp: verifyOtp.toString(),
          otpExpiresAt,
          role: UserRole.USER,
        }),
      );

      try {
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
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await this.userRepo.update(
      { email: registerDto.email },
      { otp: verifyOtp.toString(), otpExpiresAt },
    );
    const emailText = `Your OTP is ${verifyOtp}`;

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
    const existUser = await this.userRepo.findOne({
      where: { email: verifyRegisterDto.email },
    });
    if (!existUser) {
      throw new BadRequestException(
        responseHelper.error('User does not exist', {
          email: ['User does not exist'],
        }),
      );
    }
    if (existUser.otpExpiresAt && existUser.otpExpiresAt < new Date()) {
      throw new BadRequestException(
        responseHelper.error('OTP has expired. Please request a new one.', {
          otp: ['OTP has expired'],
        }),
      );
    }

    if (existUser.otp === verifyRegisterDto.otp) {
      const token = this.jwtService.sign({
        id: existUser.id,
        email: existUser.email,
        role: existUser.role,
      });
      await this.userRepo.update(
        { email: verifyRegisterDto.email },
        { otp: null, otpExpiresAt: null },
      );
      const user = await this.userRepo.findOne({
        where: { email: verifyRegisterDto.email },
        select: ['id', 'email', 'phone'],
      });
      return responseHelper.success('User verified successfully', {
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
        },
        token,
      });
    }
    throw new BadRequestException(
      responseHelper.error('Invalid OTP', {
        otp: ['Invalid OTP'],
      }),
    );
  }

  async initAdmins() {
    const adminEmail = process.env.ADMIN_EMAIL || 'adhikarishishir50@gmail.com';
    const user = await this.userRepo.findOne({ where: { email: adminEmail } });
    if (!user) {
      await this.userRepo.save(
        this.userRepo.create({
          email: adminEmail,
          role: UserRole.ADMIN,
        }),
      );
      return responseHelper.success('Admin created successfully');
    }
    throw new BadRequestException(
      responseHelper.error('Admin already exists', {
        email: ['Admin already exists'],
      }),
    );
  }

  async createAdmin(createAdminDto: CreateAdminDto) {
    try {
      const admin = await this.userRepo.save(
        this.userRepo.create({
          ...createAdminDto,
          role: UserRole.ADMIN,
        }),
      );
      return responseHelper.success('Admin created successfully', admin);
    } catch (error) {
      throw new InternalServerErrorException(
        responseHelper.error('Failed to create admin', error.message),
      );
    }
  }
}

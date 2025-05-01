import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsString,
  IsOptional,
  IsEmail,
  IsPhoneNumber,
  IsDateString,
  IsNumber,
  Min,
  Max,
  IsIn,
} from 'class-validator';

export class CreateBookingDto {
  @IsInt()
  @ApiProperty()
  packageId: number;

  @IsOptional()
  @IsDateString()
  @ApiProperty()
  startDate?: Date;
  @ApiProperty()
  @IsOptional()
  @IsDateString()
  endDate?: Date;
  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;
  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email?: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  country?: string;
  @ApiProperty()
  @IsOptional()
  phone?: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  emergency?: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  flightArrival?: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  flightDeparture?: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  otherInformation?: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsIn(['pending', 'confirmed', 'cancelled']) // Example statuses
  status?: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsIn(['pending', 'paid', 'failed']) // Example payment statuses
  paymentStatus?: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  tripCode?: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  type?: string;
  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(0)
  totalPrice?: number;
  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(0)
  price?: number;
  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(0)
  extraPrice?: number;
  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(0)
  extraDays?: number;
  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(0)
  extraNights?: number;
  @ApiProperty()
  @IsOptional()
  @IsDateString()
  bookingDate?: Date;
  @ApiProperty()
  @IsOptional()
  @IsString()
  howdidyouhear?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(0)
  prePayment?: number;
}

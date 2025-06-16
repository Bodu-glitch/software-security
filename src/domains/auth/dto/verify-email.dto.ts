import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyEmailDto {
  @IsString()
  verificationToken: string;
  @IsString()
  verificationCode: string
}
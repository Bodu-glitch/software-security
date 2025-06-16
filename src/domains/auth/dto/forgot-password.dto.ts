import { IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordDto {
  //username: string;
  @IsNotEmpty()
  @IsString()
  userName: string;
}
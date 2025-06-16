import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsUUID } from 'class-validator';

export class UpdateUserDto {
  @IsUUID()
  userId: string;

  @IsString()
  name: string
}
